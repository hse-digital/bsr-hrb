using System.Globalization;
using System.Net;
using System.Text.RegularExpressions;
using AutoMapper;
using DurableTask.Core;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.DynamicsSynchronisation;
using HSEPortal.API.Model.Payment;
using HSEPortal.API.Model.Payment.Request;
using HSEPortal.API.Model.Payment.Response;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.DurableTask;
using Microsoft.DurableTask.Client;
using Microsoft.Extensions.Options;
using BuildingApplicationStatus = HSEPortal.API.Model.BuildingApplicationStatus;

namespace HSEPortal.API.Functions;

public class PaymentFunctions
{
    private readonly DynamicsService dynamicsService;
    private readonly IMapper mapper;
    private readonly IntegrationsOptions integrationOptions;
    private readonly SwaOptions swaOptions;

    public PaymentFunctions(IOptions<IntegrationsOptions> integrationOptions, IOptions<SwaOptions> swaOptions, DynamicsService dynamicsService, IMapper mapper)
    {
        this.dynamicsService = dynamicsService;
        this.mapper = mapper;
        this.integrationOptions = integrationOptions.Value;
        this.swaOptions = swaOptions.Value;
    }

    [Function(nameof(InitialisePayment))]
    public async Task<HttpResponseData> InitialisePayment(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(InitialisePayment)}/{{applicationId}}")]
        HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", Id = "{applicationId}", PartitionKey = "{applicationId}", Connection = "CosmosConnection")]
        BuildingApplicationModel applicationModel)
    {
        var paymentModel = BuildPaymentRequestModel(applicationModel);
        var validation = paymentModel.Validate();
        if (!validation.IsValid)
        {
            return request.CreateResponse(HttpStatusCode.BadRequest);
        }

        var paymentRequestModel = mapper.Map<PaymentApiRequestModel>(paymentModel);
        paymentRequestModel.description = $"Payment for application {applicationModel.Id}";
        paymentRequestModel.amount = integrationOptions.PaymentAmount;
        paymentRequestModel.return_url = $"{swaOptions.Url}/application/{applicationModel.Id}/payment/confirm?reference={paymentModel.Reference}";
        paymentRequestModel.metadata = new Dictionary<string, object> { ["application"] = "hrbportal", ["environment"] = integrationOptions.Environment, ["applicationid"] = applicationModel.Id };

        var response = await integrationOptions.PaymentEndpoint
            .AppendPathSegments("v1", "payments")
            .WithOAuthBearerToken(integrationOptions.PaymentApiKey)
            .PostJsonAsync(paymentRequestModel);

        if (response.StatusCode == (int)HttpStatusCode.BadRequest)
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var paymentApiResponse = await response.GetJsonAsync<PaymentApiResponseModel>();
        var paymentResponse = mapper.Map<PaymentResponseModel>(paymentApiResponse);
        await dynamicsService.NewPayment(applicationModel.Id, paymentResponse);

        return await request.CreateObjectResponseAsync(paymentResponse);
    }

    [Function(nameof(InitialiseInvoicePayment))]
    public async Task<HttpResponseData> InitialiseInvoicePayment(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(InitialiseInvoicePayment)}/{{applicationId}}")]
        HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", Id = "{applicationId}", PartitionKey = "{applicationId}", Connection = "CosmosConnection")]
        BuildingApplicationModel applicationModel)
    {
        var invoiceRequest = await request.ReadAsJsonAsync<NewInvoicePaymentRequestModel>();
        await dynamicsService.NewInvoicePayment(applicationModel, invoiceRequest);

        return request.CreateResponse();
    }

    [Function(nameof(InvoicePaid))]
    public async Task InvoicePaid([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var invoiceRequest = await request.ReadAsJsonAsync<InvoicePaidEventData>();
        await dynamicsService.UpdateInvoicePayment(invoiceRequest);
    }

    [Function(nameof(GovukPaymentProcessed))]
    public async Task GovukPaymentProcessed([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request,
        [DurableClient] DurableTaskClient durableTaskClient,
        [CosmosDBInput("hseportal", "building-registrations", Id = "{resource.metadata.applicationid}", PartitionKey = "{resource.metadata.applicationid}", Connection = "CosmosConnection")]
        BuildingApplicationModel applicationModel)
    {
        var invoiceRequest = await request.ReadAsJsonAsync<GovukPaymentEventData>();
        await durableTaskClient.ScheduleNewOrchestrationInstanceAsync(nameof(GovukPaymentProcessedOrchestration), new GovukPaymentProcessedModel(applicationModel, invoiceRequest));
    }

    [Function(nameof(GovukPaymentProcessedOrchestration))]
    public async Task<BuildingApplicationModel> GovukPaymentProcessedOrchestration([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var model = orchestrationContext.GetInput<GovukPaymentProcessedModel>();
        var dynamicsBuildingApplication = await orchestrationContext.CallActivityAsync<DynamicsBuildingApplication>(nameof(GetBuildingApplicationUsingIdActivity), model.GovukPaymentEvent.EventData.Metadata["applicationid"].ToString());

        var invoiceRequest = model.GovukPaymentEvent;
        var paymentModel = new BuildingApplicationPayment(dynamicsBuildingApplication.bsr_buildingapplicationid, new PaymentResponseModel
        {
            Country = invoiceRequest.EventData.CardDetails.BillingAddress.Country,
            City = invoiceRequest.EventData.CardDetails.BillingAddress.City,
            AddressLineOne = invoiceRequest.EventData.CardDetails.BillingAddress.Line1,
            AddressLineTwo = invoiceRequest.EventData.CardDetails.BillingAddress.Line2,
            CardExpiryDate = invoiceRequest.EventData.CardDetails.ExpiryDate,
            CardBrand = invoiceRequest.EventData.CardDetails.CardBrand,
            CardType = invoiceRequest.EventData.CardDetails.CardType,
            LastFourDigitsCardNumber = invoiceRequest.EventData.CardDetails.LastDigits,
            FirstDigitsCardNumber = invoiceRequest.EventData.CardDetails.FirstDigits,
            Postcode = invoiceRequest.EventData.CardDetails.BillingAddress.Postcode,
            Email = invoiceRequest.EventData.Email,
            Reference = invoiceRequest.EventData.Reference,
            Amount = invoiceRequest.EventData.Amount,
            CreatedDate = invoiceRequest.EventData.CreatedDate,
            Status = invoiceRequest.EventData.State.Status,
            PaymentId = invoiceRequest.EventData.PaymentId,
        });

        await orchestrationContext.CallActivityAsync(nameof(CreateCardPaymentActivity), paymentModel);

        var applicationModel = model.ApplicationModel;
        if (invoiceRequest?.EventType == "card_payment_succeeded")
        {
            applicationModel = applicationModel with { ApplicationStatus = applicationModel.ApplicationStatus | BuildingApplicationStatus.PaymentComplete };
            await orchestrationContext.CallActivityAsync(nameof(UpdateBuildingApplicationActivity), new GovukPaymentApplicationModel(applicationModel, dynamicsBuildingApplication.bsr_buildingapplicationid));
        }

        return applicationModel;
    }

    [Function(nameof(GetBuildingApplicationUsingIdActivity))]
    public async Task<DynamicsBuildingApplication> GetBuildingApplicationUsingIdActivity([ActivityTrigger] string applicationId)
    {
        return await dynamicsService.GetBuildingApplicationUsingId(applicationId);
    }

    [Function(nameof(CreateCardPaymentActivity))]
    public async Task CreateCardPaymentActivity([ActivityTrigger] BuildingApplicationPayment buildingApplicationPayment)
    {
        await dynamicsService.CreateCardPayment(buildingApplicationPayment);
    }

    [Function(nameof(UpdateBuildingApplicationActivity))]
    [CosmosDBOutput("hseportal", "building-registrations", Connection = "CosmosConnection")]
    public async Task<BuildingApplicationModel> UpdateBuildingApplicationActivity([ActivityTrigger] GovukPaymentApplicationModel govukPaymentApplicationModel)
    {
        await dynamicsService.UpdateBuildingApplication(new DynamicsBuildingApplication { bsr_buildingapplicationid = govukPaymentApplicationModel.ApplicationId },
            new DynamicsBuildingApplication { bsr_submittedon = DateTime.Now.ToString(CultureInfo.InvariantCulture), bsr_applicationstage = BuildingApplicationStage.ApplicationSubmitted });

        return govukPaymentApplicationModel.ApplicationModel;
    }

    [Function(nameof(GetPayment))]
    public async Task<HttpResponseData> GetPayment([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(GetPayment)}/{{paymentReference}}")] HttpRequestData request,
        string paymentReference)
    {
        if (paymentReference == null || paymentReference.Equals(string.Empty))
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var dynamicsPayment = await dynamicsService.GetPaymentByReference(paymentReference);
        if (dynamicsPayment == null)
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var response = await integrationOptions.PaymentEndpoint
            .AppendPathSegments("v1", "payments", dynamicsPayment.bsr_govukpaymentid)
            .WithOAuthBearerToken(integrationOptions.PaymentApiKey)
            .AllowHttpStatus(HttpStatusCode.BadRequest)
            .GetJsonAsync<PaymentApiResponseModel>();

        var paymentFunctionResponse = mapper.Map<PaymentResponseModel>(response);
        return await request.CreateObjectResponseAsync(paymentFunctionResponse);
    }

    private static PaymentRequestModel BuildPaymentRequestModel(BuildingApplicationModel applicationModel)
    {
        var address = applicationModel.CurrentVersion.AccountablePersons[0].PapAddress ?? applicationModel.CurrentVersion.AccountablePersons[0].Address;
        var paymentModel = new PaymentRequestModel
        {
            Reference = Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray())[..22], @"\W", "0"),
            Email = applicationModel.ContactEmailAddress,
            CardHolderDetails = new CardHolderDetails
            {
                Name = $"{applicationModel.ContactFirstName} {applicationModel.ContactLastName}",
                Address = new CardHolderAddress { Line1 = address?.Address, Line2 = address?.AddressLineTwo, Postcode = address?.Postcode, City = address?.Town }
            }
        };
        return paymentModel;
    }
}

public record GovukPaymentProcessedModel(BuildingApplicationModel ApplicationModel, GovukPaymentEventData GovukPaymentEvent);

public record GovukPaymentApplicationModel(BuildingApplicationModel ApplicationModel, string ApplicationId);