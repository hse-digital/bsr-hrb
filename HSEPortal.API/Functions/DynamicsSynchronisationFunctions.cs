using System.Globalization;
using AutoMapper;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.DynamicsSynchronisation;
using HSEPortal.API.Model.Payment.Response;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.DurableTask;
using Microsoft.DurableTask.Client;
using Microsoft.Extensions.Options;
using BuildingApplicationStatuscode = HSEPortal.Domain.Entities.BuildingApplicationStatuscode;

namespace HSEPortal.API.Functions;

public class DynamicsSynchronisationFunctions
{
    private readonly DynamicsService dynamicsService;
    private readonly IMapper mapper;
    private readonly IntegrationsOptions integrationOptions;

    public DynamicsSynchronisationFunctions(DynamicsService dynamicsService, IOptions<IntegrationsOptions> integrationOptions, IMapper mapper)
    {
        this.dynamicsService = dynamicsService;
        this.mapper = mapper;
        this.integrationOptions = integrationOptions.Value;
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

    [Function(nameof(UpdateDynamicsBuildingSummaryStage))]
    public async Task<HttpResponseData> UpdateDynamicsBuildingSummaryStage([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        await UpdateBuildingApplicationStage(buildingApplicationModel, new DynamicsBuildingApplication
        {
            bsr_applicationstage = BuildingApplicationStage.BuildingSummary,
            statuscode = BuildingApplicationStatuscode.InProgress
        });

        return request.CreateResponse();
    }

    [Function(nameof(UpdateDynamicsAccountablePersonsStage))]
    public async Task<HttpResponseData> UpdateDynamicsAccountablePersonsStage([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        await UpdateBuildingApplicationStage(buildingApplicationModel, new DynamicsBuildingApplication
        {
            bsr_applicationstage = BuildingApplicationStage.AccountablePersons
        });

        return request.CreateResponse();
    }

    private async Task UpdateBuildingApplicationStage(BuildingApplicationModel buildingApplicationModel, DynamicsBuildingApplication buildingApplication)
    {
        var application = await dynamicsService.GetBuildingApplicationUsingId(buildingApplicationModel.Id);
        var currentStage = application.bsr_applicationstage != null ? (int)application.bsr_applicationstage : 0;
        if (currentStage < (int)buildingApplication.bsr_applicationstage!)
        {
            await dynamicsService.UpdateBuildingApplication(application, buildingApplication);
        }
    }

    [Function(nameof(SynchroniseBuildingStructures))]
    public async Task SynchroniseBuildingStructures([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var buildingApplicationModel = orchestrationContext.GetInput<BuildingApplicationModel>();

        var dynamicsBuildingApplication = await orchestrationContext.CallActivityAsync<DynamicsBuildingApplication>(nameof(GetBuildingApplicationUsingId), buildingApplicationModel.Id);
        if (dynamicsBuildingApplication != null)
        {
            await orchestrationContext.CallActivityAsync(nameof(CreateBuildingStructures), new Structures(buildingApplicationModel.CurrentVersion.Sections, dynamicsBuildingApplication));
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
            await orchestrationContext.CallActivityAsync(nameof(UpdateDuplicateBuildingApplicationAssociations), new BuildingApplicationWrapper(buildingApplicationModel, dynamicsBuildingApplication, BuildingApplicationStage.PayAndApply));
        }
    }

    [Function(nameof(SynchronisePayment))]
    public async Task SynchronisePayment([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var buildingApplicationModel = orchestrationContext.GetInput<BuildingApplicationModel>();

        var dynamicsBuildingApplication = await orchestrationContext.CallActivityAsync<DynamicsBuildingApplication>(nameof(GetBuildingApplicationUsingId), buildingApplicationModel.Id);
        if (dynamicsBuildingApplication != null)
        {
            var buildingApplicationWrapper = new BuildingApplicationWrapper(buildingApplicationModel, dynamicsBuildingApplication, BuildingApplicationStage.PayAndApply);
            await orchestrationContext.CallActivityAsync(nameof(UpdateBuildingApplication), buildingApplicationWrapper);

            var payments = await orchestrationContext.CallActivityAsync<List<DynamicsPayment>>(nameof(GetDynamicsPayments), buildingApplicationModel.Id);
            var paymentSyncTasks = payments.Select(async payment =>
            {
                var paymentResponse = await orchestrationContext.CallActivityAsync<PaymentResponseModel>(nameof(GetPaymentStatus), payment.bsr_govukpaymentid);
                if (paymentResponse != null)
                {
                    await orchestrationContext.CallActivityAsync(nameof(CreateOrUpdatePayment), new BuildingApplicationPayment(dynamicsBuildingApplication.bsr_buildingapplicationid, paymentResponse));
                    if (paymentResponse.Status == "success" && dynamicsBuildingApplication.bsr_applicationstage != BuildingApplicationStage.ApplicationSubmitted)
                    {
                        await orchestrationContext.CallActivityAsync(nameof(UpdateBuildingToSubmitted), dynamicsBuildingApplication);
                    }
                }

                return paymentResponse;
            }).ToArray();

            await Task.WhenAll(paymentSyncTasks);
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
        var manualAddresses = CountManualAddresses(buildingApplicationWrapper.Model);
        var stage = buildingApplicationWrapper.DynamicsBuildingApplication.bsr_applicationstage == BuildingApplicationStage.ApplicationSubmitted ? BuildingApplicationStage.ApplicationSubmitted : buildingApplicationWrapper.Stage;
        return dynamicsService.UpdateBuildingApplication(buildingApplicationWrapper.DynamicsBuildingApplication, new DynamicsBuildingApplication
        {
            bsr_applicationstage = stage,
            bsr_declarationconfirmed = buildingApplicationWrapper.Stage is BuildingApplicationStage.ApplicationSubmitted or BuildingApplicationStage.PayAndApply,
            bsr_numberofmanuallyenteredaddresses = manualAddresses.ToString(),
            bsr_duplicatedetected = buildingApplicationWrapper.Model.DuplicateDetected,
            bsr_sharedetailsdeclared = buildingApplicationWrapper.Model.ShareDetailsDeclared,
        });
    }

    [Function(nameof(UpdateDuplicateBuildingApplicationAssociations))]
    public Task UpdateDuplicateBuildingApplicationAssociations([ActivityTrigger] BuildingApplicationWrapper buildingApplicationWrapper)
    {
        return dynamicsService.CreateAssociatedDuplicatedBuildingApplications(buildingApplicationWrapper.Model, buildingApplicationWrapper.DynamicsBuildingApplication);        
    }

    [Function(nameof(UpdateBuildingToSubmitted))]
    public Task UpdateBuildingToSubmitted([ActivityTrigger] DynamicsBuildingApplication buildingApplication)
    {
        return dynamicsService.UpdateBuildingApplication(buildingApplication, new DynamicsBuildingApplication
        {
            bsr_submittedon = DateTime.Now.ToString(CultureInfo.InvariantCulture),
            bsr_applicationstage = BuildingApplicationStage.ApplicationSubmitted
        });
    }

    private int CountManualAddresses(BuildingApplicationModel model)
    {
        var buildingApplicationVersion = model.CurrentVersion;
        var manualStructureAddresses = buildingApplicationVersion.Sections?.SelectMany(x => x.Addresses).Count(x => x.IsManual) ?? 0;
        var manualApAddresses = buildingApplicationVersion.AccountablePersons?.Where(x => x.PapAddress != null).Select(x => x.PapAddress).Count(x => x.IsManual) ?? 0;
        var manualPapAddresses = buildingApplicationVersion.AccountablePersons?.Where(x => x.Address != null).Select(x => x.Address).Count(x => x.IsManual) ?? 0;
        var manualActingForAddress = buildingApplicationVersion.AccountablePersons?.Where(x => x.ActingForAddress != null).Select(x => x.ActingForAddress).Count(x => x.IsManual) ?? 0;

        return manualStructureAddresses + manualApAddresses + manualPapAddresses + manualActingForAddress;
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

    [Function(nameof(GetDynamicsPayments))]
    public Task<List<DynamicsPayment>> GetDynamicsPayments([ActivityTrigger] string applicationId)
    {
        return dynamicsService.GetPayments(applicationId);
    }

    [Function(nameof(CreateOrUpdatePayment))]
    public async Task CreateOrUpdatePayment([ActivityTrigger] BuildingApplicationPayment buildingApplicationPayment)
    {
        await dynamicsService.CreateCardPayment(buildingApplicationPayment);
    }

    [Function(nameof(GetPaymentStatus))]
    public async Task<PaymentResponseModel> GetPaymentStatus([ActivityTrigger] string paymentId)
    {
        PaymentApiResponseModel response;
        var retryCount = 0;

        do
        {
            response = await integrationOptions.PaymentEndpoint
                .AppendPathSegments("v1", "payments", paymentId)
                .WithOAuthBearerToken(integrationOptions.PaymentApiKey)
                .GetJsonAsync<PaymentApiResponseModel>();

            if (ShouldRetry(response.state.status, retryCount))
            {
                await Task.Delay(3000);
                retryCount++;
            }
        } while (ShouldRetry(response.state.status, retryCount));

        return mapper.Map<PaymentResponseModel>(response);
    }

    [Function(nameof(UpdateBuildingApplicationInCosmos))]
    [CosmosDBOutput("hseportal", "building-registrations", Connection = "CosmosConnection")]
    public BuildingApplicationModel UpdateBuildingApplicationInCosmos([ActivityTrigger] BuildingApplicationModel buildingApplicationModel)
    {
        return buildingApplicationModel;
    }

    private bool ShouldRetry(string status, int retryCount)
    {
        if (status != "success" && status != "failed" && status != "cancelled" && status != "error")
        {
            return retryCount < 3;
        }

        return false;
    }
}