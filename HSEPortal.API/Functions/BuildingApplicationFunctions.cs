using System.Net;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Functions;

public class BuildingApplicationFunctions
{
    private readonly DynamicsService dynamicsService;

    public BuildingApplicationFunctions(DynamicsService dynamicsService)
    {
        this.dynamicsService = dynamicsService;
    }

    [Function(nameof(NewBuildingApplication))]
    public async Task<CustomHttpResponseData> NewBuildingApplication([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var validation = buildingApplicationModel.Validate();
        if (!validation.IsValid)
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
    public async Task<HttpResponseData> GetApplication([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetApplication/{applicationNumber}")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT * FROM c WHERE c.id = {applicationNumber}", PartitionKey = "{applicationNumber}", Connection = "CosmosConnection")]
        List<BuildingApplicationModel> buildingApplications)
    {
        if (buildingApplications.Any())
            return await request.CreateObjectResponseAsync(buildingApplications[0]);

        return request.CreateResponse(HttpStatusCode.BadRequest);
    }
}

public class CustomHttpResponseData
{
    [CosmosDBOutput("hseportal", "building-registrations", Connection = "CosmosConnection")]
    public object Application { get; set; }

    public HttpResponseData HttpResponse { get; set; }
}