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

    public BuildingApplicationFunctions(DynamicsService dynamicsService, OTPService otpService, IOptions<FeatureOptions> featureOptions)
    {
        this.dynamicsService = dynamicsService;
        this.otpService = otpService;
        this.featureOptions = featureOptions.Value;
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
        return new CustomHttpResponseData
        {
            Application = buildingApplicationModel,
            HttpResponse = response
        };
    }

    [Function(nameof(ValidateApplicationNumber))]
    public HttpResponseData ValidateApplicationNumber([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "ValidateApplicationNumber/{applicationNumber}/{emailAddress}")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT * FROM c WHERE c.id = {applicationNumber} and c.ContactEmailAddress = {emailAddress}", Connection = "CosmosConnection")]
        List<BuildingApplicationModel> buildingApplications)
    {
        return request.CreateResponse(buildingApplications.Any() ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
    }

    [Function(nameof(GetApplication))]
    public async Task<HttpResponseData> GetApplication([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetApplication/{applicationNumber}/{emailAddress}/{otpToken}")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT * FROM c WHERE c.id = {applicationNumber} and c.ContactEmailAddress = {emailAddress}", PartitionKey = "{applicationNumber}", Connection = "CosmosConnection")]
        List<BuildingApplicationModel> buildingApplications, string otpToken)
    {
        if (buildingApplications.Any())
        {
            var application = buildingApplications[0];
            if (otpService.ValidateToken(otpToken, application.ContactEmailAddress) || featureOptions.DisableOtpValidation)
            {
                return await request.CreateObjectResponseAsync(application);
            }
        }

        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    [Function(nameof(UpdateApplication))]
    public async Task<CustomHttpResponseData> UpdateApplication([HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "UpdateApplication/{applicationNumber}")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var validation = buildingApplicationModel.Validate();
        if (!validation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(validation);
        }

        return new CustomHttpResponseData
        {
            Application = buildingApplicationModel,
            HttpResponse = request.CreateResponse(HttpStatusCode.OK)
        };
    }

    [Function(nameof(GetApplicationPaymentStatus))]
    public async Task<HttpResponseData> GetApplicationPaymentStatus([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(GetApplicationPaymentStatus)}/{{applicationNumber}}")] HttpRequestData request,
        string applicationNumber)
    {
        var dynamicsPayments = await dynamicsService.GetPayments(applicationNumber);
        var payments = dynamicsPayments.Select(payment => new
        {
            payment.bsr_paymentid,
            payment.bsr_govukpaystatus,
            payment.bsr_paymentreconciliationstatus
        });
        
        return await request.CreateObjectResponseAsync(payments);
    }
}

public class CustomHttpResponseData
{
    [CosmosDBOutput("hseportal", "building-registrations", Connection = "CosmosConnection")]
    public object Application { get; set; }

    public HttpResponseData HttpResponse { get; set; }
}