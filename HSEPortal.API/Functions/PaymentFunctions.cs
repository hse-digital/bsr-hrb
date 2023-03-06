using System.Net;
using AutoMapper;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Extensions;
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

    private readonly int amount = 250;
    private readonly string returnUrl = "return url";
    private readonly string description = "description";
    private string reference = "";

    public PaymentFunctions(IOptions<IntegrationsOptions> integrationOptions, IMapper mapper)
    {
        this.mapper = mapper;
        this.integrationOptions = integrationOptions.Value;
    }

    [Function(nameof(InitialisePayment))]
    public async Task<HttpResponseData> InitialisePayment([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var paymentModel = await request.ReadAsJsonAsync<PaymentRequestModel>();
        this.reference = paymentModel.Reference;

        if (description.Equals(string.Empty) || amount == -1 || returnUrl.Equals(string.Empty) || reference.Equals(string.Empty))
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var paymentApiResquetModel = mapper.Map<PaymentApiRequestModel>(paymentModel);

        var response = await this.integrationOptions.PaymentEndpoint
                                .AppendPathSegments("v1", "payments")
                                .WithOAuthBearerToken(this.integrationOptions.PaymentApiKey)
                                .PostJsonAsync(paymentApiResquetModel);

        if (response.StatusCode == (int)HttpStatusCode.BadRequest)
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var paymentApiResponse = await response.GetJsonAsync<PaymentApiResponseModel>();
        var paymentFunctionResponse = mapper.Map<PaymentResponseModel>(paymentApiResponse);
        return await request.CreateObjectResponseAsync(paymentFunctionResponse);
    }


    [Function(nameof(GetPayment))]
    public async Task<HttpResponseData> GetPayment([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(GetPayment)}/{{paymentId}}")] HttpRequestData request, string paymentId)
    {
        if (paymentId == null || paymentId.Equals(string.Empty))
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var response = await this.integrationOptions.PaymentEndpoint
                            .AppendPathSegments("v1", "payments", paymentId ?? "")
                            .WithOAuthBearerToken(this.integrationOptions.PaymentApiKey)
                            .AllowHttpStatus(HttpStatusCode.BadRequest)
                            .GetJsonAsync<PaymentApiResponseModel>();

        var paymentFunctionResponse = mapper.Map<PaymentResponseModel>(response);
        return await request.CreateObjectResponseAsync(paymentFunctionResponse);
    }
}
