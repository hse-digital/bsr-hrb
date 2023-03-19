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

    [Function(nameof(SyncAccountablePersons))]
    public async Task<HttpResponseData> SyncAccountablePersons([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, [DurableClient] DurableTaskClient durableTaskClient)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        await durableTaskClient.ScheduleNewOrchestrationInstanceAsync(nameof(SynchroniseAccountablePersons), buildingApplicationModel);

        return request.CreateResponse();
    }

    [Function(nameof(SyncDeclaration))]
    public async Task<HttpResponseData> SyncDeclaration([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, [DurableClient] DurableTaskClient durableTaskClient)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        await durableTaskClient.ScheduleNewOrchestrationInstanceAsync(nameof(SynchroniseDeclaration), buildingApplicationModel);

        return request.CreateResponse();
    }

    [Function(nameof(SyncPayment))]
    public async Task<HttpResponseData> SyncPayment([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, [DurableClient] DurableTaskClient durableTaskClient)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        await durableTaskClient.ScheduleNewOrchestrationInstanceAsync(nameof(SynchronisePayment), buildingApplicationModel);

        return request.CreateResponse();
    }

    [Function(nameof(SynchroniseBuildingStructures))]
    public async Task SynchroniseBuildingStructures([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var buildingApplicationModel = orchestrationContext.GetInput<BuildingApplicationModel>();

        var dynamicsBuildingApplication = await orchestrationContext.CallActivityAsync<DynamicsBuildingApplication>(nameof(GetBuildingApplicationUsingId), buildingApplicationModel.Id);
        if (dynamicsBuildingApplication != null)
        {
            await orchestrationContext.CallActivityAsync(nameof(UpdateBuildingApplication), new BuildingApplicationWrapper(buildingApplicationModel, dynamicsBuildingApplication, BuildingApplicationStage.BuildingSummary));
            await orchestrationContext.CallActivityAsync(nameof(CreateBuildingStructures), new Structures(buildingApplicationModel.Sections, dynamicsBuildingApplication));
        }
    }

    [Function(nameof(SynchroniseDeclaration))]
    public async Task SynchroniseDeclaration([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var buildingApplicationModel = orchestrationContext.GetInput<BuildingApplicationModel>();

        var dynamicsBuildingApplication = await orchestrationContext.CallActivityAsync<DynamicsBuildingApplication>(nameof(GetBuildingApplicationUsingId), buildingApplicationModel.Id);
        if (dynamicsBuildingApplication != null)
        {
            await orchestrationContext.CallActivityAsync(nameof(UpdateBuildingApplication), new BuildingApplicationWrapper(buildingApplicationModel, dynamicsBuildingApplication, BuildingApplicationStage.PayAndApply));
        }
    }

    [Function(nameof(SynchronisePayment))]
    public async Task SynchronisePayment([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var buildingApplicationModel = orchestrationContext.GetInput<BuildingApplicationModel>();

        var dynamicsBuildingApplication = await orchestrationContext.CallActivityAsync<DynamicsBuildingApplication>(nameof(GetBuildingApplicationUsingId), buildingApplicationModel.Id);
        if (dynamicsBuildingApplication != null)
        {
            var buildingApplicationWrapper = new BuildingApplicationWrapper(buildingApplicationModel, dynamicsBuildingApplication, BuildingApplicationStage.ApplicationSubmitted);
            await orchestrationContext.CallActivityAsync(nameof(UpdateBuildingApplication), buildingApplicationWrapper);
            await orchestrationContext.CallActivityAsync(nameof(CreatePayment), buildingApplicationWrapper);
        }
    }

    [Function(nameof(SynchroniseAccountablePersons))]
    public async Task SynchroniseAccountablePersons([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var buildingApplicationModel = orchestrationContext.GetInput<BuildingApplicationModel>();

        var dynamicsBuildingApplication = await orchestrationContext.CallActivityAsync<DynamicsBuildingApplication>(nameof(GetBuildingApplicationUsingId), buildingApplicationModel.Id);
        if (dynamicsBuildingApplication != null)
        {
            var buildingApplicationWrapper = new BuildingApplicationWrapper(buildingApplicationModel, dynamicsBuildingApplication, BuildingApplicationStage.AccountablePersons);
            await orchestrationContext.CallActivityAsync(nameof(UpdateBuildingApplication), buildingApplicationWrapper);
            await orchestrationContext.CallActivityAsync(nameof(CreateAccountablePersons), buildingApplicationWrapper);
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
        return dynamicsService.UpdateBuildingApplication(buildingApplicationWrapper.DynamicsBuildingApplication, new DynamicsBuildingApplication
        {
            bsr_applicationstage = buildingApplicationWrapper.Stage,
            bsr_declarationconfirmed = buildingApplicationWrapper.Stage is BuildingApplicationStage.ApplicationSubmitted or BuildingApplicationStage.PayAndApply
        });
    }

    [Function(nameof(CreateBuildingStructures))]
    public Task CreateBuildingStructures([ActivityTrigger] Structures structures)
    {
        return dynamicsService.CreateBuildingStructures(structures);
    }

    [Function(nameof(CreateAccountablePersons))]
    public Task CreateAccountablePersons([ActivityTrigger] BuildingApplicationWrapper buildingApplicationWrapper)
    {
        return dynamicsService.CreateAccountablePersons(buildingApplicationWrapper.Model, buildingApplicationWrapper.DynamicsBuildingApplication);
    }

    [Function(nameof(CreatePayment))]
    public Task CreatePayment([ActivityTrigger] BuildingApplicationWrapper buildingApplicationWrapper)
    {
        return dynamicsService.CreatePayment(buildingApplicationWrapper.Model, buildingApplicationWrapper.DynamicsBuildingApplication);
    }
}