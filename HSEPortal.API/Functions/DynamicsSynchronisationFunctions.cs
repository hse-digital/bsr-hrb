using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.DynamicsSynchronisation;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.DurableTask;
using Microsoft.DurableTask.Client;

namespace HSEPortal.API.Functions;

public class DynamicsSynchronisationFunctions
{
    private readonly DynamicsService dynamicsService;

    public DynamicsSynchronisationFunctions(DynamicsService dynamicsService)
    {
        this.dynamicsService = dynamicsService;
    }

    [Function(nameof(SyncBuildingStructures))]
    public async Task<HttpResponseData> SyncBuildingStructures([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, [DurableClient] DurableTaskClient durableTaskClient)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        await durableTaskClient.ScheduleNewOrchestrationInstanceAsync(nameof(SynchroniseBuildingStructures), buildingApplicationModel);

        return request.CreateResponse();
    }

    [Function(nameof(SynchroniseBuildingStructures))]
    public async Task SynchroniseBuildingStructures([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var buildingApplicationModel = orchestrationContext.GetInput<BuildingApplicationModel>();

        var dynamicsBuildingApplication = await orchestrationContext.CallActivityAsync<DynamicsBuildingApplication>(nameof(GetBuildingApplicationUsingId), buildingApplicationModel.Id);
        if (dynamicsBuildingApplication != null)
        {
            await orchestrationContext.CallActivityAsync(nameof(UpdateBuildingApplication), new BuildingApplicationWrapper(buildingApplicationModel, dynamicsBuildingApplication));
            await orchestrationContext.CallActivityAsync(nameof(CreateBuildingStructures), new Structures(buildingApplicationModel.Sections, dynamicsBuildingApplication));
        }
    }

    [Function(nameof(GetBuildingApplicationUsingId))]
    public Task<DynamicsBuildingApplication> GetBuildingApplicationUsingId([ActivityTrigger] string applicationId)
    {
        return dynamicsService.GetBuildingApplicationUsingId(applicationId);
    }

    [Function(nameof(UpdateBuildingApplication))]
    public Task UpdateBuildingApplication([ActivityTrigger] BuildingApplicationWrapper buildingApplicationWrapper)
    {
        return dynamicsService.UpdateBuildingApplication(buildingApplicationWrapper.Model, buildingApplicationWrapper.DynamicsBuildingApplication, BuildingApplicationStage.BuildingSummary);
    }

    [Function(nameof(CreateBuildingStructures))]
    public Task CreateBuildingStructures([ActivityTrigger] Structures structures)
    {
        return dynamicsService.CreateBuildingStructures(structures);
    }
}