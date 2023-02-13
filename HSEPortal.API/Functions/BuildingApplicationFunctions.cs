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
        var buildingRegistrationModel = await request.ReadAsJsonAsync<BuildingRegistrationModel>();
        var validation = buildingRegistrationModel.Validate();
        if (!validation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(validation);
        }
        
        await dynamicsService.RegisterNewBuildingApplicationAsync(buildingRegistrationModel);
        return new CustomHttpResponseData
        {
            CosmosDocument = buildingRegistrationModel,
            HttpResponse = request.CreateResponse()
        };
    }
}

public class CustomHttpResponseData
{
    [CosmosDBOutput("hseportal", "building-registrations", Connection = "CosmosConnection")]
    public object CosmosDocument { get; set; }

    public HttpResponseData HttpResponse { get; set; }
}