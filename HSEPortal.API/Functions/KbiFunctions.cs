using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.DurableTask;
using Microsoft.DurableTask.Client;

namespace HSEPortal.API.Functions;

public class KbiFunctions
{
    private readonly KbiService kbiService;

    public KbiFunctions(KbiService kbiService)
    {
        this.kbiService = kbiService;
    }
    
    [Function(nameof(SyncKbiStructureStart))]
    public async Task<HttpResponseData> SyncKbiStructureStart([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, [DurableClient] DurableTaskClient durableTaskClient)
    { 
        var kbiSectionModel = await request.ReadAsJsonAsync<KbiSectionModel>();
        await durableTaskClient.ScheduleNewOrchestrationInstanceAsync(nameof(SynchroniseKbiStructureStart), kbiSectionModel);

        return request.CreateResponse();
    }
    
    [Function(nameof(SyncKbiFireAndEnergy))]
    public async Task<HttpResponseData> SyncKbiFireAndEnergy([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, [DurableClient] DurableTaskClient durableTaskClient)
    { 
        var kbiSectionModel = await request.ReadAsJsonAsync<KbiSectionModel>();
        await durableTaskClient.ScheduleNewOrchestrationInstanceAsync(nameof(SynchroniseKbiFireAndEnergy), kbiSectionModel);

        return request.CreateResponse();
    }
    
    [Function(nameof(SyncKbiStructureRoofStaircasesAndWalls))]
    public async Task<HttpResponseData> SyncKbiStructureRoofStaircasesAndWalls([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, [DurableClient] DurableTaskClient durableTaskClient)
    { 
        var kbiSectionModel = await request.ReadAsJsonAsync<KbiSectionModel>();
        await durableTaskClient.ScheduleNewOrchestrationInstanceAsync(nameof(SynchroniseKbiFireAndEnergy), kbiSectionModel);

        return request.CreateResponse();
    }
    
    [Function(nameof(SyncKbiBuildingUseConnectionsAndDeclaration))]
    public async Task<HttpResponseData> SyncKbiBuildingUseConnectionsAndDeclaration([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, [DurableClient] DurableTaskClient durableTaskClient)
    { 
        var kbiSectionModel = await request.ReadAsJsonAsync<KbiSectionModel>();
        await durableTaskClient.ScheduleNewOrchestrationInstanceAsync(nameof(SynchroniseKbiFireAndEnergy), kbiSectionModel);

        return request.CreateResponse();
    }

    [Function(nameof(SynchroniseKbiStructureStart))]
    public async Task SynchroniseKbiStructureStart([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var kbiSectionModel = orchestrationContext.GetInput<KbiSectionModel>();

        var dynamicsStructure = await orchestrationContext.CallActivityAsync<DynamicsStructure>(nameof(GetDynamicsStructure), kbiSectionModel);
        
        var kbiSyncData = new KbiSyncData(dynamicsStructure, kbiSectionModel);
        await orchestrationContext.CallActivityAsync(nameof(UpdateKbiStructureStart), kbiSyncData);
    }

    [Function(nameof(SynchroniseKbiFireAndEnergy))]
    public async Task SynchroniseKbiFireAndEnergy([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var kbiSectionModel = orchestrationContext.GetInput<KbiSectionModel>();

        var dynamicsStructure = await orchestrationContext.CallActivityAsync<DynamicsStructure>(nameof(GetDynamicsStructure), kbiSectionModel);
        
        var kbiSyncData = new KbiSyncData(dynamicsStructure, kbiSectionModel);
        await orchestrationContext.CallActivityAsync(nameof(UpdateSectionFireData), kbiSyncData);
        await orchestrationContext.CallActivityAsync(nameof(UpdateSectionEnergyData), kbiSyncData);
    }

    [Function(nameof(SynchroniseKbiStructureRoofStaircasesAndWalls))]
    public async Task SynchroniseKbiStructureRoofStaircasesAndWalls([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var kbiSectionModel = orchestrationContext.GetInput<KbiSectionModel>();

        var dynamicsStructure = await orchestrationContext.CallActivityAsync<DynamicsStructure>(nameof(GetDynamicsStructure), kbiSectionModel);
        
        var kbiSyncData = new KbiSyncData(dynamicsStructure, kbiSectionModel);
        await orchestrationContext.CallActivityAsync(nameof(UpdateSectionStructureData), kbiSyncData);
        await orchestrationContext.CallActivityAsync(nameof(UpdateSectionRoofData), kbiSyncData);
        await orchestrationContext.CallActivityAsync(nameof(UpdateSectionStaircasesData), kbiSyncData);
        await orchestrationContext.CallActivityAsync(nameof(UpdateSectionWallsData), kbiSyncData);
    }

    [Function(nameof(SynchroniseKbiBuildingUseConnectionsAndDeclaration))]
    public async Task SynchroniseKbiBuildingUseConnectionsAndDeclaration([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var kbiSectionModel = orchestrationContext.GetInput<KbiSectionModel>();

        var dynamicsStructure = await orchestrationContext.CallActivityAsync<DynamicsStructure>(nameof(GetDynamicsStructure), kbiSectionModel);
        
        var kbiSyncData = new KbiSyncData(dynamicsStructure, kbiSectionModel);
        await orchestrationContext.CallActivityAsync(nameof(UpdateSectionBuildingUseData), kbiSyncData);
        //await orchestrationContext.CallActivityAsync(nameof(UpdateSectionConnectionsData), kbiSyncData); // pending angular development
        //await orchestrationContext.CallActivityAsync(nameof(UpdateSectionDeclarationData), kbiSyncData); // pending angular development
    }

    [Function(nameof(GetDynamicsStructure))]
    public Task<DynamicsStructure> GetDynamicsStructure([ActivityTrigger] KbiSectionModel kbiSectionModel)
    {
        return kbiService.GetDynamicsStructure(kbiSectionModel.StructureName, kbiSectionModel.Postcode);
    }

    [Function(nameof(UpdateKbiStructureStart))]
    public Task UpdateKbiStructureStart([ActivityTrigger] KbiSyncData kbySyncData)
    {
        return kbiService.UpdateKbiStructureStart(kbySyncData);
    }

    [Function(nameof(UpdateSectionFireData))]
    public Task UpdateSectionFireData([ActivityTrigger] KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionFireData(kbySyncData);
    }

    [Function(nameof(UpdateSectionEnergyData))]
    public Task UpdateSectionEnergyData([ActivityTrigger] KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionEnergyData(kbySyncData);
    }

    [Function(nameof(UpdateSectionStructureData))]
    public Task UpdateSectionStructureData([ActivityTrigger] KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionStructureData(kbySyncData);
    }

    [Function(nameof(UpdateSectionRoofData))]
    public Task UpdateSectionRoofData([ActivityTrigger] KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionRoofData(kbySyncData);
    }

    [Function(nameof(UpdateSectionStaircasesData))]
    public Task UpdateSectionStaircasesData([ActivityTrigger] KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionStaircasesData(kbySyncData);
    }

    [Function(nameof(UpdateSectionWallsData))]
    public Task UpdateSectionWallsData([ActivityTrigger] KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionWallsData(kbySyncData);
    }

    [Function(nameof(UpdateSectionBuildingUseData))]
    public Task UpdateSectionBuildingUseData([ActivityTrigger] KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionBuildingUseData(kbySyncData);
    }
}

public record KbiSyncData(DynamicsStructure DynamicsStructure, KbiSectionModel KbiSectionModel);