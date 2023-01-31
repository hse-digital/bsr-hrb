using System.Text.Json;
using Flurl.Http;
using HSEPortal.API.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API
{
    public class BuildingFunctions
    {
        [Function(nameof(SaveBuildingDetails))]
        public async Task SaveBuildingDetails([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData request)
        {
            var buildingDetails = JsonSerializer.Deserialize<BuildingDetails>(request.Body);

            await "https://dynamicsapi"
                .PostJsonAsync(buildingDetails);
        }
    }
}