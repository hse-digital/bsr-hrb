using HSEPortal.API.Extensions;
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
    public async Task<HttpResponseData> NewBuildingApplication([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData request)
    {
        var buildingRegistrationModel = await request.ReadAsJsonAsync<BuildingRegistrationModel>();
        var validation = buildingRegistrationModel.Validate();
        if (!validation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(validation);
        }

        await dynamicsService.RegisterNewBuildingApplicationAsync(buildingRegistrationModel);
        return request.CreateResponse();
    }
}