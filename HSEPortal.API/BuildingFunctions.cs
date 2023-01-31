using System.Net;
using Flurl.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace HSEPortal.API
{
    public class BuildingFunctions
    {
        [Function(nameof(SaveBuildingName))]
        public async Task<IFlurlResponse> SaveBuildingName([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestMessage request)
        {
            string buildingName = request.Headers.GetValues("buildingName").First();

            var response = await "https://dynamicsapi"
                .PostJsonAsync(new { buildingName = buildingName });

            return response;
        }

        [Function(nameof(SaveBuildingFloorsAbove))]
        public async Task<IFlurlResponse> SaveBuildingFloorsAbove([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestMessage request)
        {
            string floorsAbove = request.Headers.GetValues("floorsAbove").First();

            var response = await "https://dynamicsapi"
                .PostJsonAsync(new { floorsAbove = floorsAbove });

            return response;
        }


        [Function(nameof(SaveBuildingHeight))]
        public async Task<IFlurlResponse> SaveBuildingHeight([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestMessage request)
        {
            string height = request.Headers.GetValues("height").First();

            var response = await "https://dynamicsapi"
                .PostJsonAsync(new { height = height });

            return response;
        }

        [Function(nameof(SaveBuildingPeopleLivingInBuilding))]
        public async Task<IFlurlResponse> SaveBuildingPeopleLivingInBuilding([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestMessage request)
        {
            string peopleLivingInBuilding = request.Headers.GetValues("peopleLivingInBuilding").First();

            var response = await "https://dynamicsapi"
                .PostJsonAsync(new { peopleLivingInBuilding = peopleLivingInBuilding });

            return response;
        }

        [Function(nameof(SaveBuildingResidentialUnits))]
        public async Task<IFlurlResponse> SaveBuildingResidentialUnits([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestMessage request)
        {
            string residentialUnits = request.Headers.GetValues("residentialUnits").First();

            var response = await "https://dynamicsapi"
                .PostJsonAsync(new { residentialUnits = residentialUnits });

            return response;
        }
    }
}
