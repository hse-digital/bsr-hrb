using System.Globalization;
using System.Net;
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
using BuildingApplicationStatus = HSEPortal.Domain.Entities.BuildingApplicationStatus;

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
    public async Task<HttpResponseData> UpdateDynamicsBuildingSummaryStage([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, [DurableClient] DurableTaskClient durableTaskClient)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var application = await dynamicsService.GetBuildingApplicationUsingId(buildingApplicationModel.Id);
        if (application is { bsr_applicationstage: null, statuscode: BuildingApplicationStatus.New })
        {
            await dynamicsService.UpdateBuildingApplication(application, new DynamicsBuildingApplication
            {
                bsr_applicationstage = BuildingApplicationStage.BuildingSummary,
                statuscode = BuildingApplicationStatus.InProgress
            });
        }

        return request.CreateResponse();
    }

    [Function(nameof(SynchroniseBuildingStructures))]
    public async Task SynchroniseBuildingStructures([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var buildingApplicationModel = orchestrationContext.GetInput<BuildingApplicationModel>();

        var dynamicsBuildingApplication = await orchestrationContext.CallActivityAsync<DynamicsBuildingApplication>(nameof(GetBuildingApplicationUsingId), buildingApplicationModel.Id);
        if (dynamicsBuildingApplication != null)
        {
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

            var paymentResponse = await orchestrationContext.CallActivityAsync<PaymentResponseModel>(nameof(GetPaymentStatus), buildingApplicationWrapper);
            if (paymentResponse != null)
            {
                buildingApplicationWrapper = buildingApplicationWrapper with { Model = buildingApplicationWrapper.Model with { Payment = paymentResponse } };
            }

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
    public async Task CreatePayment([ActivityTrigger] BuildingApplicationWrapper buildingApplicationWrapper)
    {
        await dynamicsService.CreatePayment(buildingApplicationWrapper.Model, buildingApplicationWrapper.DynamicsBuildingApplication);
    }

    [Function(nameof(GetPaymentStatus))]
    public async Task<PaymentResponseModel> GetPaymentStatus([ActivityTrigger] BuildingApplicationWrapper buildingApplicationWrapper)
    {
        var response = await integrationOptions.PaymentEndpoint
            .AppendPathSegments("v1", "payments", buildingApplicationWrapper.Model.Payment.PaymentId)
            .WithOAuthBearerToken(integrationOptions.PaymentApiKey)
            .GetJsonAsync<PaymentApiResponseModel>();

        return mapper.Map<PaymentResponseModel>(response);
    }
}