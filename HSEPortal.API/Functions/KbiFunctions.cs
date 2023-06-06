using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
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
    
    [Function(nameof(SyncFire))]
    public async Task<HttpResponseData> SyncFire([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, [DurableClient] DurableTaskClient durableTaskClient)
    {
        var kbiSectionModel = await request.ReadAsJsonAsync<KbiSectionModel>();
        await durableTaskClient.ScheduleNewOrchestrationInstanceAsync(nameof(SynchroniseFire), kbiSectionModel);

        return request.CreateResponse();
    }

    [Function(nameof(SynchroniseFire))]
    public async Task SynchroniseFire([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var kbiSectionModel = orchestrationContext.GetInput<KbiSectionModel>();

        await orchestrationContext.CallActivityAsync(nameof(UpdateSectionFireData), kbiSectionModel);
    }

    public Task UpdateSectionFireData([ActivityTrigger] KbiSectionModel kbiSectionModel)
    {
        return kbiService.UpdateSectionFireData(kbiSectionModel);
    }
}