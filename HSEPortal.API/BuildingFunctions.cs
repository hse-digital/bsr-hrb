using System.Text.Json;
using HSEPortal.API.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API;

public class BuildingFunctions
{
    private readonly DynamicsService dynamicsService;

    public BuildingFunctions(DynamicsService dynamicsService)
    {
        this.dynamicsService = dynamicsService;
    }
    
    [Function(nameof(SaveBuildingDetails))]
    public async Task SaveBuildingDetails([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData request)
    {
        var buildingDetails = JsonSerializer.Deserialize<BuildingDetails>(request.Body)!;

        await dynamicsService.SaveBuildingDetailsRecord(buildingDetails);
    }
}