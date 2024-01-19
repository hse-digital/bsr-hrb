using System.Diagnostics;
using System.Net;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.DurableTask;
using Microsoft.DurableTask.Client;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Functions;

public class BuildingApplicationFunctions
{
    private readonly DynamicsService dynamicsService;
    private readonly OTPService otpService;
    private readonly FeatureOptions featureOptions;
    private readonly IntegrationsOptions integrationOptions;

    public BuildingApplicationFunctions(DynamicsService dynamicsService, OTPService otpService, IOptions<FeatureOptions> featureOptions,
        IOptions<IntegrationsOptions> integrationOptions)
    {
        this.dynamicsService = dynamicsService;
        this.otpService = otpService;
        this.featureOptions = featureOptions.Value;
        this.integrationOptions = integrationOptions.Value;
    }

    [Function(nameof(NewBuildingApplication))]
    public async Task<CustomHttpResponseData> NewBuildingApplication([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var validation = buildingApplicationModel.Validate();
        if (!featureOptions.DisableOtpValidation && !validation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(validation);
        }

        buildingApplicationModel = await dynamicsService.RegisterNewBuildingApplicationAsync(buildingApplicationModel);
        buildingApplicationModel = buildingApplicationModel with
        {
            Versions = new List<BuildingApplicationVersion>
            {
                new("original")
            }
        };
        
        var response = await request.CreateObjectResponseAsync(buildingApplicationModel);
        return new CustomHttpResponseData { Application = buildingApplicationModel, HttpResponse = response };
    }

    [Function(nameof(ValidateApplicationNumber))]
    public async Task<HttpResponseData> ValidateApplicationNumber([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "ValidateApplicationNumber")] HttpRequestData request)
    {
        var validateApplicationRequest = await request.ReadAsJsonAsync<ValidateApplicationRequest>();
        var matchingApplication = await dynamicsService.ValidateExistingApplication(validateApplicationRequest.ApplicationNumber, validateApplicationRequest.EmailAddress);

        return request.CreateResponse(matchingApplication != null ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
    }

    [Function(nameof(GetSubmissionDate))]
    public async Task<HttpResponseData> GetSubmissionDate(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetSubmissionDate/{applicationNumber}")]
        HttpRequestData request, string applicationNumber)
    {
        string submissionDate = await dynamicsService.GetSubmissionDate(applicationNumber);
        return await request.CreateObjectResponseAsync(submissionDate);
    }

    [Function(nameof(GetKbiSubmissionDate))]
    public async Task<HttpResponseData> GetKbiSubmissionDate(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetKbiSubmissionDate/{applicationNumber}")]
        HttpRequestData request, string applicationNumber)
    {
        string submissionDate = await dynamicsService.GetKbiSubmissionDate(applicationNumber);
        return await request.CreateObjectResponseAsync(submissionDate);
    }

    [Function(nameof(GetApplication))]
    public async Task<HttpResponseData> GetApplication([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "GetApplication")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT * FROM c WHERE c.id = {ApplicationNumber}", PartitionKey = "{ApplicationNumber}", Connection = "CosmosConnection")]
        List<BuildingApplicationModel> buildingApplications)
    {
        var requestContent = await request.ReadAsJsonAsync<GetApplicationRequest>();

        var matchingApplication = await dynamicsService.ValidateExistingApplication(requestContent.ApplicationNumber, requestContent.EmailAddress);
        if (matchingApplication != null)
        {
            var application = buildingApplications[0];
            var tokenIsValid = await otpService.ValidateToken(requestContent.OtpToken, application.ContactEmailAddress)
                               || await otpService.ValidateToken(requestContent.OtpToken, application.SecondaryEmailAddress)
                               || await otpService.ValidateToken(requestContent.OtpToken, application.NewPrimaryUserEmail)
                               || await otpService.ValidateToken(requestContent.OtpToken, requestContent.EmailAddress);

            if (tokenIsValid || featureOptions.DisableOtpValidation)
            {
                if (application.Versions == null || application.Versions.Count == 0)
                {
                    application = application with
                    {
                        Versions = new List<BuildingApplicationVersion>
                        {
                            new("original", Sections: application.Sections, AccountablePersons: application.AccountablePersons, Kbi: application.Kbi)
                        },
                        Sections = null,
                        AccountablePersons = null,
                        Kbi = null
                    };
                }

                application = application with { BuildingName = matchingApplication.bsr_Building.bsr_name };
                return await request.CreateObjectResponseAsync(application);
            }
        }

        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    [Function(nameof(GetRegisteredStructure))]
    public async Task<HttpResponseData> GetRegisteredStructure([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "GetRegisteredStructure")] HttpRequestData request)
    {
        var requestData = await request.ReadAsJsonAsync<RegisteredStructureRequestModel>();

        if (!IsRequestDataValid(requestData)) return request.CreateResponse(HttpStatusCode.BadRequest);

        var dynamicsResponse = await dynamicsService.FindExistingStructureWithAccountablePersonAsync(requestData.Postcode);

        RegisteredStructureModel responseModel = BuildAlreadyRegisteredStructureResponseModel(dynamicsResponse, requestData.AddressLineOne);

        return responseModel != null
            ? await request.CreateObjectResponseAsync(responseModel)
            : request.CreateResponse(HttpStatusCode.ExpectationFailed);
    }

    private bool IsRequestDataValid(RegisteredStructureRequestModel requestData)
    {
        return requestData != null
               && requestData.Postcode != null
               && !requestData.Postcode.Equals(string.Empty)
               && requestData.AddressLineOne != null
               && !requestData.AddressLineOne.Equals(string.Empty);
    }

    private RegisteredStructureModel BuildAlreadyRegisteredStructureResponseModel(DynamicsResponse<IndependentSection> dynamicsResponse, string addressLineOne)
    {
        IndependentSection section = dynamicsResponse.value.Find(section => IsSectionComplete(section, addressLineOne));

        if (section != null)
        {
            var response = new RegisteredStructureModel
            {
                BuildingName = section.bsr_BuildingId.bsr_name,
                Name = section.bsr_name,
                BlockId = section.bsr_blockid,
                BuildingApplicationId = section.bsr_BuildingApplicationID.bsr_buildingapplicationid,
                Height = section.bsr_sectionheightinmetres.ToString(),
                NumFloors = section.bsr_nooffloorsabovegroundlevel.ToString(),
                ResidentialUnits = section.bsr_numberofresidentialunits.ToString(),
                StructureAddress = new BuildingAddress
                {
                    Postcode = section.bsr_postcode,
                    Address = section.bsr_addressline1,
                    AddressLineTwo = section.bsr_addressline2,
                    Town = section.bsr_city
                }
            };

            bool PapIsOrganisation = section.bsr_BuildingApplicationID.bsr_paptype == 760810001;
            if (PapIsOrganisation)
            {
                response = response with
                {
                    PapAddress = new BuildingAddress
                    {
                        Postcode = section.bsr_BuildingApplicationID.bsr_papid_account.address1_postalcode,
                        Address = section.bsr_BuildingApplicationID.bsr_papid_account.address1_line1,
                        AddressLineTwo = section.bsr_BuildingApplicationID.bsr_papid_account.address1_line2,
                        Town = section.bsr_BuildingApplicationID.bsr_papid_account.address1_city
                    },
                    PapName = section.bsr_BuildingApplicationID.bsr_papid_account.name,
                    PapIsOrganisation = PapIsOrganisation
                };
            }

            return response;
        }

        return null;
    }

    private bool IsSectionComplete(IndependentSection section, string addressLineOne)
    {
        bool isComplete = section != null
                          && section.bsr_BuildingId != null
                          && IsNotNullOrWhitespace(section.bsr_BuildingId.bsr_name)
                          && section.bsr_BuildingApplicationID != null
                          && section.bsr_BuildingApplicationID.bsr_paptype != null
                          && ((section.bsr_BuildingApplicationID.bsr_paptype == 760810001 && section.bsr_BuildingApplicationID.bsr_papid_account != null) ||
                              section.bsr_BuildingApplicationID.bsr_paptype == 760810000)
                          && NormaliseAddress(addressLineOne).Contains(NormaliseAddress(section.bsr_addressline1));
        return isComplete;
    }

    private bool IsNotNullOrWhitespace(string value)
    {
        return value != null && !value.Equals(string.Empty);
    }

    private string NormaliseAddress(string address)
    {
        string result = address.ToLower().Replace("  ", " ");
        return result;
    }

    [Function(nameof(UpdateApplication))]
    public async Task<CustomHttpResponseData> UpdateApplication(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "UpdateApplication/{applicationNumber}")]
        HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var validation = buildingApplicationModel.Validate();
        if (!validation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(validation);
        }

        return new CustomHttpResponseData { Application = buildingApplicationModel, HttpResponse = request.CreateResponse(HttpStatusCode.OK) };
    }

    [Function(nameof(GetApplicationPaymentStatus))]
    public async Task<HttpResponseData> GetApplicationPaymentStatus([HttpTrigger(AuthorizationLevel.Anonymous, "get",
            Route = $"{nameof(GetApplicationPaymentStatus)}/{{applicationNumber}}")]
        HttpRequestData request,
        string applicationNumber)
    {
        var dynamicsPayments = await dynamicsService.GetPayments(applicationNumber);
        var payments = dynamicsPayments.Select(payment => new
        {
            payment.bsr_paymentid,
            payment.bsr_govukpaystatus,
            payment.bsr_paymentreconciliationstatus,
            payment.bsr_amountpaid,
            payment.bsr_transactionid,
            payment.bsr_timeanddateoftransaction,
            payment.bsr_invoicecreationdate
        });

        return await request.CreateObjectResponseAsync(payments);
    }

    [Function(nameof(GetApplicationCost))]
    public async Task<HttpResponseData> GetApplicationCost([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request)
    {
        var applicationCost = new { applicationCost = integrationOptions.PaymentAmount / 100 };
        return await request.CreateObjectResponseAsync(applicationCost);
    }

    [Function(nameof(GetBuildingApplicationStatuscode))]
    public async Task<HttpResponseData> GetBuildingApplicationStatuscode([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request)
    {
        var parameters = request.GetQueryParameters();
        var applicationid = parameters["applicationid"];

        if (string.IsNullOrWhiteSpace(applicationid))
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var statuscodeModel = await dynamicsService.GetBuildingApplicationStatuscodeBy(applicationid);
        return await request.CreateObjectResponseAsync(statuscodeModel?.statuscode);
    }
}

public class CustomHttpResponseData
{
    [CosmosDBOutput("hseportal", "building-registrations", Connection = "CosmosConnection")]
    public object Application { get; set; }

    public HttpResponseData HttpResponse { get; set; }
}

public class GetApplicationRequest
{
    public string ApplicationNumber { get; set; }
    public string EmailAddress { get; set; }
    public string OtpToken { get; set; }
}

public record RegisteredStructureModel
{
    public string BuildingName { get; set; }
    public string Name { get; set; }
    public string BlockId { get; set; }
    public string BuildingApplicationId { get; set; }
    public string NumFloors { get; set; }
    public string Height { get; set; }
    public string ResidentialUnits { get; set; }
    public BuildingAddress StructureAddress { get; set; }
    public string PapName { get; set; }
    public BuildingAddress PapAddress { get; set; }
    public bool PapIsOrganisation { get; set; }
}

public class RegisteredStructureRequestModel
{
    public string Postcode { get; set; }
    public string AddressLineOne { get; set; }
}

public class ApplicationNumberAndEmail
{
    public string ApplicationNumber { get; set; }
    public string EmailAddress { get; set; }
}

public record ValidateApplicationRequest(string ApplicationNumber, string EmailAddress);