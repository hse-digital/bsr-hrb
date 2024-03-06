using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.Sync;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Functions;

public class KbiFunctions
{
    private readonly KbiService kbiService;

    public KbiFunctions(KbiService kbiService)
    {
        this.kbiService = kbiService;
    }

    [Function(nameof(SyncKbiStructureStart))]
    [ServiceBusOutput(SyncKbiStartMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<SyncMessage> SyncKbiStructureStart([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(SyncKbiStructureStart)}/{{applicationId}}")] HttpRequestData request,
        string applicationId)
    {
        var sectionModel = await request.ReadAsJsonAsync<KbiSectionModel>();
        return new SyncKbiStartMessage(sectionModel, applicationId);
    }

    [Function(nameof(SyncKbiFireAndEnergy))]
    [ServiceBusOutput(SyncKbiFireAndEnergyMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<SyncMessage> SyncKbiFireAndEnergy([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(SyncKbiFireAndEnergy)}/{{applicationId}}")] HttpRequestData request,
        string applicationId)
    {
        var sectionModel = await request.ReadAsJsonAsync<KbiSectionModel>();
        return new SyncKbiFireAndEnergyMessage(sectionModel, applicationId);
    }

    [Function(nameof(SyncKbiStructureRoofStaircasesAndWalls))]
    [ServiceBusOutput(SyncKbiStructureRoofStaircasesAndWallsMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<SyncMessage> SyncKbiStructureRoofStaircasesAndWalls([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(SyncKbiStructureRoofStaircasesAndWalls)}/{{applicationId}}")] HttpRequestData request,
        string applicationId)
    {
        var sectionModel = await request.ReadAsJsonAsync<KbiSectionModel>();
        return new SyncKbiStructureRoofStaircasesAndWallsMessage(sectionModel, applicationId);
    }

    [Function(nameof(SyncKbiBuildingUse))]
    [ServiceBusOutput(SyncKbiBuildingUseMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<SyncMessage> SyncKbiBuildingUse([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(SyncKbiBuildingUse)}/{{applicationId}}")] HttpRequestData request,
        string applicationId)
    {
        var sectionModel = await request.ReadAsJsonAsync<KbiSectionModel>();
        return new SyncKbiBuildingUseMessage(sectionModel, applicationId);
    }

    [Function(nameof(SyncKbiConnectionsAndDeclaration))]
    [ServiceBusOutput(SyncKbiConnectionsAndDeclarationMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<SyncMessage> SyncKbiConnectionsAndDeclaration([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(SyncKbiConnectionsAndDeclaration)}/{{applicationId}}")] HttpRequestData request,
        string applicationId)
    {
        var kbiModel = await request.ReadAsJsonAsync<KbiModel>();
        return new SyncKbiConnectionsAndDeclarationMessage(kbiModel, applicationId);
    }

    [Function(nameof(SynchroniseKbiStructureStart))]
    public async Task SynchroniseKbiStructureStart([ServiceBusTrigger(SyncKbiStartMessage.QueueName, Connection = "ServiceBusConnection")] SyncKbiStartMessage message)
    {
        var kbiSectionModel = message.SectionModel with { ApplicationId = message.ApplicationId };
        
        var dynamicsStructure = await GetDynamicsStructure(kbiSectionModel);
        var kbiSyncData = new KbiSyncData(dynamicsStructure, kbiSectionModel);
        await UpdateKbiStructureStart(kbiSyncData);
    }

    [Function(nameof(SynchroniseKbiFireAndEnergy))]
    public async Task SynchroniseKbiFireAndEnergy([ServiceBusTrigger(SyncKbiFireAndEnergyMessage.QueueName, Connection = "ServiceBusConnection")] SyncKbiFireAndEnergyMessage message)
    {
        var kbiSectionModel = message.SectionModel with { ApplicationId = message.ApplicationId };
        
        var dynamicsStructure = await GetDynamicsStructure(kbiSectionModel);

        var kbiSyncData = new KbiSyncData(dynamicsStructure, kbiSectionModel);
        await UpdateSectionFireData(kbiSyncData);
        await UpdateSectionEnergyData(kbiSyncData);
    }

    [Function(nameof(SynchroniseKbiStructureRoofStaircasesAndWalls))]
    public async Task SynchroniseKbiStructureRoofStaircasesAndWalls([ServiceBusTrigger(SyncKbiStructureRoofStaircasesAndWallsMessage.QueueName, Connection = "ServiceBusConnection")] SyncKbiStructureRoofStaircasesAndWallsMessage message)
    {
        var kbiSectionModel = message.SectionModel with { ApplicationId = message.ApplicationId };
        
        var dynamicsStructure = await GetDynamicsStructure(kbiSectionModel);

        var kbiSyncData = new KbiSyncData(dynamicsStructure, kbiSectionModel);
        await UpdateSectionStructureData(kbiSyncData);
        await UpdateSectionRoofData(kbiSyncData);
        await UpdateSectionStaircasesData(kbiSyncData);
        await UpdateSectionWallsData(kbiSyncData);
    }

    [Function(nameof(SynchroniseKbiBuildingUse))]
    public async Task SynchroniseKbiBuildingUse([ServiceBusTrigger(SyncKbiBuildingUseMessage.QueueName, Connection = "ServiceBusConnection")] SyncKbiBuildingUseMessage message)
    {
        var kbiSectionModel = message.SectionModel with { ApplicationId = message.ApplicationId };
        
        var dynamicsStructure = await GetDynamicsStructure(kbiSectionModel);

        var kbiSyncData = new KbiSyncData(dynamicsStructure, kbiSectionModel);
        await UpdateSectionBuildingUseData(kbiSyncData);
    }

    [Function(nameof(SynchroniseConnectionsAndDeclaration))]
    public async Task SynchroniseConnectionsAndDeclaration([ServiceBusTrigger(SyncKbiConnectionsAndDeclarationMessage.QueueName, Connection = "ServiceBusConnection")] SyncKbiConnectionsAndDeclarationMessage message)
    {
        var dynamicsStructure = await GetDynamicsStructure(message.KbiModel.KbiSections[0] with { ApplicationId = message.ApplicationId });
        var kbiSyncData = new KbiSyncData(dynamicsStructure, null, message.KbiModel);

        await UpdateSectionConnectionsData(kbiSyncData);
        foreach (var section in message.KbiModel.KbiSections)
        {
            dynamicsStructure = await GetDynamicsStructure(section with { ApplicationId = message.ApplicationId });
            await UpdateSectionDeclarationData(kbiSyncData with { DynamicsStructure = dynamicsStructure });
        }
    }

    private Task<DynamicsStructure> GetDynamicsStructure(KbiSectionModel kbiSectionModel)
    {
        return kbiService.GetDynamicsStructure(kbiSectionModel.StructureName, kbiSectionModel.Postcode, kbiSectionModel.ApplicationId);
    }

    private Task UpdateKbiStructureStart(KbiSyncData kbySyncData)
    {
        return kbiService.UpdateKbiStructureStart(kbySyncData);
    }

    private Task UpdateSectionFireData(KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionFireData(kbySyncData);
    }

    private Task UpdateSectionEnergyData(KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionEnergyData(kbySyncData);
    }

    private Task UpdateSectionStructureData(KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionStructureData(kbySyncData);
    }

    private Task UpdateSectionRoofData(KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionRoofData(kbySyncData);
    }

    private Task UpdateSectionStaircasesData(KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionStaircasesData(kbySyncData);
    }

    private Task UpdateSectionWallsData(KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionWallsData(kbySyncData);
    }

    private Task UpdateSectionBuildingUseData(KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionBuildingUseData(kbySyncData);
    }

    private Task UpdateSectionConnectionsData(KbiSyncData kbiSyncData)
    {
        return kbiService.UpdateSectionConnectionsData(kbiSyncData);
    }

    private Task UpdateSectionDeclarationData(KbiSyncData kbySyncData)
    {
        return kbiService.UpdateSectionDeclarationData(kbySyncData);
    }
}

public record KbiSyncData(DynamicsStructure DynamicsStructure, KbiSectionModel KbiSectionModel, KbiModel KbiModel = null);