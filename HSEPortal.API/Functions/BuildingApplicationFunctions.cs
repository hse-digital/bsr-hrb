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
}

public class CustomHttpResponseData
{
    [CosmosDBOutput("hseportal", "building-registrations", Connection = "CosmosConnection")]
    public object Application { get; set; }

    public HttpResponseData HttpResponse { get; set; }
}