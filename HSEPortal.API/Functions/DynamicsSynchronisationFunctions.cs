using System.Globalization;
using AutoMapper;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.DynamicsSynchronisation;
using HSEPortal.API.Model.Payment;
using HSEPortal.API.Model.Payment.Response;
using HSEPortal.API.Model.Sync;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
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
    [ServiceBusOutput(SyncBuildingStructuresMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<SyncMessage> SyncBuildingStructures([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        return new SyncBuildingStructuresMessage(buildingApplicationModel);
    }

    [Function(nameof(SyncAccountablePersons))]
    [ServiceBusOutput(SyncAccountablePersonsMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<SyncMessage> SyncAccountablePersons([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        return new SyncAccountablePersonsMessage(buildingApplicationModel);
    }

    [Function(nameof(SyncDeclaration))]
    [ServiceBusOutput(SyncDeclarationMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<SyncMessage> SyncDeclaration([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        return new SyncDeclarationMessage(buildingApplicationModel);
    }

    [Function(nameof(syncCertificateDeclaration))]
    [ServiceBusOutput(SyncCertificateDeclarationMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<SyncMessage> syncCertificateDeclaration([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        // TODO for certificate
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        return new SyncCertificateDeclarationMessage(buildingApplicationModel);
    }

    [Function(nameof(SyncPayment))]
    [ServiceBusOutput(SyncPaymentMessage.QueueName, Connection = "ServiceBusConnection")]
    public async Task<SyncMessage> SyncPayment([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        return new SyncPaymentMessage(buildingApplicationModel);
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
    public async Task SynchroniseBuildingStructures([ServiceBusTrigger(SyncBuildingStructuresMessage.QueueName, Connection = "ServiceBusConnection")] SyncBuildingStructuresMessage message)
    {
        var buildingApplicationModel = message.ApplicationModel;
        var dynamicsBuildingApplication = await GetBuildingApplicationUsingId(buildingApplicationModel.Id);
        if (dynamicsBuildingApplication != null)
        {
            await CreateBuildingStructures(new Structures(buildingApplicationModel.CurrentVersion.Sections, dynamicsBuildingApplication));
        }
    }

    [Function(nameof(SynchroniseDeclaration))]
    public async Task SynchroniseDeclaration([ServiceBusTrigger(SyncDeclarationMessage.QueueName, Connection = "ServiceBusConnection")] SyncDeclarationMessage message)
    {
        var buildingApplicationModel = message.ApplicationModel;

        var dynamicsBuildingApplication = await GetBuildingApplicationUsingId(buildingApplicationModel.Id);
        if (dynamicsBuildingApplication != null)
        {
            await UpdateBuildingApplication(new BuildingApplicationWrapper(buildingApplicationModel, dynamicsBuildingApplication, BuildingApplicationStage.PayAndApply));
            await UpdateDuplicateBuildingApplicationAssociations(new BuildingApplicationWrapper(buildingApplicationModel, dynamicsBuildingApplication, BuildingApplicationStage.PayAndApply));
        }
    }

    [Function(nameof(SynchronisePayment))]
    public async Task SynchronisePayment([ServiceBusTrigger(SyncPaymentMessage.QueueName, Connection = "ServiceBusConnection")] SyncPaymentMessage message)
    {
        var buildingApplicationModel = message.ApplicationModel;

        var dynamicsBuildingApplication = await GetBuildingApplicationUsingId(buildingApplicationModel.Id);
        if (dynamicsBuildingApplication != null)
        {
            var buildingApplicationWrapper = new BuildingApplicationWrapper(buildingApplicationModel, dynamicsBuildingApplication, BuildingApplicationStage.PayAndApply);
            await UpdateBuildingApplication(buildingApplicationWrapper);

            var payments = await GetDynamicsPayments(buildingApplicationModel.Id);
            var paymentSyncTasks = payments.Select(async payment =>
            {
                var paymentResponse = await GetPaymentStatus(payment);
                if (paymentResponse != null)
                {
                    await CreateOrUpdatePayment(new BuildingApplicationPayment(dynamicsBuildingApplication.bsr_buildingapplicationid, paymentResponse));
                    if (paymentResponse.Status == "success" && dynamicsBuildingApplication.bsr_applicationstage != BuildingApplicationStage.ApplicationSubmitted)
                    {
                        await UpdateBuildingToSubmitted(dynamicsBuildingApplication);
                    }
                }

                return paymentResponse;
            }).ToArray();

            await Task.WhenAll(paymentSyncTasks);
        }
    }

    [Function(nameof(SynchroniseAccountablePersons))]
    public async Task SynchroniseAccountablePersons([ServiceBusTrigger(SyncAccountablePersonsMessage.QueueName, Connection = "ServiceBusConnection")] SyncAccountablePersonsMessage message)
    {
        var buildingApplicationModel = message.ApplicationModel;

        var dynamicsBuildingApplication = await GetBuildingApplicationUsingId(buildingApplicationModel.Id);
        if (dynamicsBuildingApplication != null)
        {
            var buildingApplicationWrapper = new BuildingApplicationWrapper(buildingApplicationModel, dynamicsBuildingApplication, BuildingApplicationStage.AccountablePersons);
            await UpdateBuildingApplication(buildingApplicationWrapper);
            await CreateAccountablePersons(buildingApplicationWrapper);
        }
    }

    private Task<DynamicsBuildingApplication> GetBuildingApplicationUsingId(string applicationId)
    {
        return dynamicsService.GetBuildingApplicationUsingId(applicationId);
    }

    private Task UpdateBuildingApplication(BuildingApplicationWrapper buildingApplicationWrapper)
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

    private Task UpdateDuplicateBuildingApplicationAssociations(BuildingApplicationWrapper buildingApplicationWrapper)
    {
        return dynamicsService.CreateAssociatedDuplicatedBuildingApplications(buildingApplicationWrapper.Model, buildingApplicationWrapper.DynamicsBuildingApplication);
    }

    private Task UpdateBuildingToSubmitted(DynamicsBuildingApplication buildingApplication)
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

    private Task CreateBuildingStructures(Structures structures)
    {
        return dynamicsService.CreateBuildingStructures(structures);
    }

    private Task CreateAccountablePersons(BuildingApplicationWrapper buildingApplicationWrapper)
    {
        return dynamicsService.CreateAccountablePersons(buildingApplicationWrapper.Model, buildingApplicationWrapper.DynamicsBuildingApplication);
    }

    private Task<List<DynamicsPayment>> GetDynamicsPayments(string applicationId)
    {
        return dynamicsService.GetPayments(applicationId);
    }

    private async Task CreateOrUpdatePayment(BuildingApplicationPayment buildingApplicationPayment)
    {
        if (buildingApplicationPayment.Payment.ProviderId == "invoice")
        {
            await dynamicsService.UpdateInvoicePayment(new InvoicePaidEventData
            {
                Data = new InvoiceObjectData
                {
                    InvoiceData = new InvoiceData
                    {
                        InvoiceMetadata = new InvoiceMetadata { PaymentId = buildingApplicationPayment.Payment.PaymentId },
                        Status = buildingApplicationPayment.Payment.Status
                    }
                }
            });
        }
        else
        {
            await dynamicsService.CreateCardPayment(buildingApplicationPayment);
        }
    }

    private async Task<PaymentResponseModel> GetPaymentStatus(DynamicsPayment dynamicsPayment)
    {
        PaymentApiResponseModel response;
        var retryCount = 0;

        if (string.IsNullOrWhiteSpace(dynamicsPayment.bsr_govukpaymentid)) // invoice payment
        {
            var invoiceResponse = await integrationOptions.CommonAPIEndpoint
                .AppendPathSegments("api", "GetInvoiceStatus", dynamicsPayment.bsr_transactionid)
                .WithHeader("x-functions-key", integrationOptions.CommonAPIKey)
                .GetJsonAsync<InvoiceData>();

            return mapper.Map<PaymentResponseModel>(invoiceResponse);
        }

        // govuk payment
        do
        {
            response = await integrationOptions.PaymentEndpoint
                .AppendPathSegments("v1", "payments", dynamicsPayment.bsr_govukpaymentid)
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

    private bool ShouldRetry(string status, int retryCount)
    {
        if (status != "success" && status != "failed" && status != "cancelled" && status != "error")
        {
            return retryCount < 3;
        }

        return false;
    }
}