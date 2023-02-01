using System.Text.Json;
using HSEPortal.API.Model;
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
    public async Task NewBuildingApplication([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await JsonSerializer.DeserializeAsync<BuildingApplicationModel>(request.Body);
        await dynamicsService.RegisterNewBuildingApplication(buildingApplicationModel);
    }
}