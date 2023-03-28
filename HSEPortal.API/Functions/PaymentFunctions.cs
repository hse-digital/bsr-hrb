using System.Net;
using System.Text.RegularExpressions;
using AutoMapper;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.Payment.Request;
using HSEPortal.API.Model.Payment.Response;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Functions;

public class PaymentFunctions
{
    private readonly IMapper mapper;
    private readonly IntegrationsOptions integrationOptions;
    private readonly SwaOptions swaOptions;

    public PaymentFunctions(IOptions<IntegrationsOptions> integrationOptions, IOptions<SwaOptions> swaOptions, IMapper mapper)
    {
        this.mapper = mapper;
        this.integrationOptions = integrationOptions.Value;
        this.swaOptions = swaOptions.Value;
    }

    [Function(nameof(InitialisePayment))]
    public async Task<HttpResponseData> InitialisePayment([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(InitialisePayment)}/{{applicationId}}")] HttpRequestData request,
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
        paymentRequestModel.amount = integrationOptions.PaymentAmount;
        paymentRequestModel.return_url = $"{swaOptions.Url}/application/{applicationModel.Id}/payment/confirm?reference={paymentModel.Reference}";

        var response = await integrationOptions.PaymentEndpoint
            .AppendPathSegments("v1", "payments")
            .WithOAuthBearerToken(integrationOptions.PaymentApiKey)
            .PostJsonAsync(paymentRequestModel);

        if (response.StatusCode == (int)HttpStatusCode.BadRequest)
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var paymentApiResponse = await response.GetJsonAsync<PaymentApiResponseModel>();
        var paymentFunctionResponse = mapper.Map<PaymentResponseModel>(paymentApiResponse);
        return await request.CreateObjectResponseAsync(paymentFunctionResponse);
    }

    private static PaymentRequestModel BuildPaymentRequestModel(BuildingApplicationModel applicationModel)
    {
        var address = applicationModel.AccountablePersons[0].PapAddress ?? applicationModel.AccountablePersons[0].Address;
        var paymentModel = new PaymentRequestModel
        {
            Reference = Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray())[..22], @"\W", "0"),
            Email = applicationModel.ContactEmailAddress,
            CardHolderDetails = new CardHolderDetails
            {
                Name = $"{applicationModel.ContactFirstName} {applicationModel.ContactLastName}",
                Address = new CardHolderAddress
                {
                    Line1 = address?.Address,
                    Line2 = address?.AddressLineTwo,
                    Postcode = address?.Postcode,
                    City = address?.Town
                }
            }
        };
        return paymentModel;
    }


    [Function(nameof(GetPayment))]
    public async Task<HttpResponseData> GetPayment([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(GetPayment)}/{{paymentId}}")] HttpRequestData request, string paymentId)
    {
        if (paymentId == null || paymentId.Equals(string.Empty))
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var response = await integrationOptions.PaymentEndpoint
            .AppendPathSegments("v1", "payments", paymentId)
            .WithOAuthBearerToken(integrationOptions.PaymentApiKey)
            .AllowHttpStatus(HttpStatusCode.BadRequest)
            .GetJsonAsync<PaymentApiResponseModel>();

        var paymentFunctionResponse = mapper.Map<PaymentResponseModel>(response);
        return await request.CreateObjectResponseAsync(paymentFunctionResponse);
    }
}