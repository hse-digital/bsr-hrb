using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.Sync;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Functions;

public class BacFunctions
{
    private readonly DynamicsService dynamicsService;
    private readonly BlobOptions blobOptions;

    public BacFunctions(DynamicsService dynamicsService, IOptions<BlobOptions> blobOptions)
    {
        this.dynamicsService = dynamicsService;
        this.blobOptions = blobOptions.Value;
    }

    [Function(nameof(GetBacInvitation))]
    public async Task<HttpResponseData> GetBacInvitation([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(GetBacInvitation)}/{{applicationId}}")] HttpRequestData requestData,
        string applicationId)
    {
        var bacApplicationDirection = await dynamicsService.GetBacApplicationDirection(applicationId);
        return await requestData.CreateObjectResponseAsync(bacApplicationDirection);
    }

    [Function(nameof(CreateBacApplication))]
    [ServiceBusOutput(CreateBacSyncMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<CreateBacSyncMessage> CreateBacApplication([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        return new CreateBacSyncMessage(buildingApplicationModel);
    }

    [Function(nameof(UpdateBacApplication))]
    [ServiceBusOutput(UpdateBacSyncMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<UpdateBacSyncMessage> UpdateBacApplication([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        return new UpdateBacSyncMessage(buildingApplicationModel);
    }

    [Function(nameof(SyncCertificateDeclaration))]
    [ServiceBusOutput(SyncCertificateDeclarationMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<SyncMessage> SyncCertificateDeclaration([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        return new SyncCertificateDeclarationMessage(buildingApplicationModel);
    }

    [Function(nameof(SyncBacDeclaration))]
    public async Task SyncBacDeclaration([ServiceBusTrigger(SyncCertificateDeclarationMessage.QueueName, Connection = "ServiceBusConnection")] SyncCertificateDeclarationMessage message)
    {
        await dynamicsService.UpdateBacDeclaration(message.ApplicationModel);
    }

    [Function(nameof(SyncCreateBacApplication))]
    public async Task SyncCreateBacApplication([ServiceBusTrigger(CreateBacSyncMessage.QueueName, Connection = "ServiceBusConnection")] CreateBacSyncMessage message)
    {
        var buildingApplicationModel = message.ApplicationModel;
        
        var dynamicsBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(buildingApplicationModel.Id);
        await dynamicsService.CreateBacApplication(buildingApplicationModel, dynamicsBuildingApplication);
    }

    [Function(nameof(SyncUpdateBacApplication))]
    public async Task SyncUpdateBacApplication([ServiceBusTrigger(UpdateBacSyncMessage.QueueName, Connection = "ServiceBusConnection")] UpdateBacSyncMessage message)
    {
        var buildingApplicationModel = message.ApplicationModel;
        
        var dynamicsBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(buildingApplicationModel.Id);
        await dynamicsService.UpdateBacApplication(buildingApplicationModel, dynamicsBuildingApplication.bsr_buildingapplicationid);
        await dynamicsService.UpdateBuildingBacInformation(buildingApplicationModel, dynamicsBuildingApplication.bsr_Building);
    }

    [Function(nameof(SyncBacStatus))]
    [ServiceBusOutput(SyncBacStatusMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<SyncMessage> SyncBacStatus([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        return new SyncBacStatusMessage(buildingApplicationModel);
    }

    [Function(nameof(SyncBacApplicationStatus))]
    public async Task SyncBacApplicationStatus([ServiceBusTrigger(SyncBacStatusMessage.QueueName, Connection = "ServiceBusConnection")] SyncBacStatusMessage message)
    {
        var buildingApplicationModel = message.ApplicationModel;
        
        await dynamicsService.UpdateBacApplicationStatus(buildingApplicationModel);
    }
}