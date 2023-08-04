using System.Diagnostics;
using System.Net;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
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
        var response = await request.CreateObjectResponseAsync(buildingApplicationModel);
        return new CustomHttpResponseData { Application = buildingApplicationModel, HttpResponse = response };
    }

    [Function(nameof(ValidateApplicationNumber))]
    public HttpResponseData ValidateApplicationNumber([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "ValidateApplicationNumber")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations",
            SqlQuery = "SELECT * FROM c WHERE c.id = {ApplicationNumber} and StringEquals(c.ContactEmailAddress, {EmailAddress}, true)", Connection = "CosmosConnection")]
        List<BuildingApplicationModel> buildingApplications)
    {
        return request.CreateResponse(buildingApplications.Any() ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
    }

    [Function(nameof(GetSubmissionDate))]
    public async Task<HttpResponseData> GetSubmissionDate(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetSubmissionDate/{applicationNumber}")]
        HttpRequestData request, string applicationNumber)
    {
        string submissionDate = await dynamicsService.GetSubmissionDate(applicationNumber);
        return await request.CreateObjectResponseAsync(submissionDate);
    }

    [Function(nameof(GetApplication))]
    public async Task<HttpResponseData> GetApplication([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "GetApplication")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations",
            SqlQuery = "SELECT * FROM c WHERE c.id = {ApplicationNumber} and StringEquals(c.ContactEmailAddress, {EmailAddress}, true)", PartitionKey = "{ApplicationNumber}",
            Connection = "CosmosConnection")]
        List<BuildingApplicationModel> buildingApplications)
    {
        var requestContent = await request.ReadAsJsonAsync<GetApplicationRequest>();
        if (buildingApplications.Any())
        {
            var application = buildingApplications[0];
            var tokenIsValid = await otpService.ValidateToken(requestContent.OtpToken, application.ContactEmailAddress);
            if (tokenIsValid || featureOptions.DisableOtpValidation)
            {
                return await request.CreateObjectResponseAsync(application);
            }
        }

        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    [Function(nameof(GetRegisteredStructure))]
    public async Task<HttpResponseData> GetRegisteredStructure([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "GetRegisteredStructure")] HttpRequestData request) {
        var requestData = await request.ReadAsJsonAsync<RegisteredStructureRequestModel>();
        var dynamicsStructure = dynamicsService.FindExistingStructureAsync(null, requestData.Postcode);
        if(dynamicsStructure.Result != null && dynamicsStructure.Result.bsr_name != null) {
            var response = new RegisteredStructureModel {
                Name = dynamicsStructure.Result.bsr_name,
                Height = dynamicsStructure.Result.bsr_sectionheightinmetres.ToString(),
                NumFloors = dynamicsStructure.Result.bsr_nooffloorsabovegroundlevel.ToString(),
                ResidentialUnits = dynamicsStructure.Result.bsr_numberofresidentialunits.ToString(),
                StructureAddress = new BuildingAddress {
                    Postcode = dynamicsStructure.Result.bsr_postcode,
                    Address = dynamicsStructure.Result.bsr_addressline1,
                    AddressLineTwo = dynamicsStructure.Result.bsr_addressline2,
                    Town = dynamicsStructure.Result.bsr_city
                },
                PapAddress = new BuildingAddress {
                    Postcode = "postcode test",
                    Address = "address line one",
                    AddressLineTwo = "address line two",
                    Town = "city"
                },
                PapName = "PAP name",
                PapIsOrganisation = true
            };
            return await request.CreateObjectResponseAsync(response);
        }
        return request.CreateResponse(HttpStatusCode.BadRequest);
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
            payment.bsr_timeanddateoftransaction
        });

        return await request.CreateObjectResponseAsync(payments);
    }

    [Function(nameof(GetApplicationCost))]
    public async Task<HttpResponseData> GetApplicationCost([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request)
    {
        var applicationCost = new { applicationCost = integrationOptions.PaymentAmount / 100 };
        return await request.CreateObjectResponseAsync(applicationCost);
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

public class RegisteredStructureModel
{
  public string Name { get; set; }
  public string NumFloors { get; set; }
  public string Height { get; set; }
  public string ResidentialUnits { get; set; }
  public BuildingAddress StructureAddress { get; set; }
  public string PapName { get; set; }
  public BuildingAddress PapAddress { get; set; }
  public bool PapIsOrganisation { get; set; }
}

public class RegisteredStructureRequestModel {
    public string Postcode {get; set;}
    public string AddressLineOne {get; set;}
}