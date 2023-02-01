using System.Text.Json;
using HSEPortal.API.Dynamics;
using HSEPortal.API.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Functions;

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
        var buildingDetails = await JsonSerializer.DeserializeAsync<Building>(request.Body);
        await dynamicsService.SaveRecord<Building, DynamicsBuilding>(buildingDetails!);
    }
}