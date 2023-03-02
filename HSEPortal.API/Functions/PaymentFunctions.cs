using System.Net;
using AutoMapper;
using Flurl.Http;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.Payment;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Functions
{
    public class PaymentFunctions
    {
        public static string baseURL = "https://publicapi.payments.service.gov.uk"; // local.settings.json
        
        private readonly IMapper mapper;

        public PaymentFunctions(IMapper mapper)
        {
            this.mapper = mapper;
        }

        [Function(nameof(InitialisePayment))]
        public async Task<HttpResponseData> InitialisePayment([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
        {
            var paymentModel = await request.ReadAsJsonAsync<PaymentRequestModel>();
            
            var response = $"{baseURL}/v1/payments".PostJsonAsync(paymentModel);

            if (response.Result.StatusCode == (int)HttpStatusCode.BadRequest)
                return request.CreateResponse(HttpStatusCode.BadRequest);

            var paymentApiResponse = await response.Result.GetJsonAsync<PaymentApiResponseModel>();
            var paymentFunctionResponse = mapper.Map<PaymentResponseModel>(paymentApiResponse);
            return await request.CreateObjectResponseAsync(paymentFunctionResponse);
        }


        [Function(nameof(GetPayment))]
        public async Task<HttpResponseData> GetPayment([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(GetPayment)}/{{paymentId}}")] HttpRequestData request, string paymentId)
        {
            var response = $"{baseURL}/v1/payments/{paymentId}".GetAsync();

            if (response.Result.StatusCode == (int)HttpStatusCode.BadRequest)
                return request.CreateResponse(HttpStatusCode.BadRequest);

            var paymentApiResponse = await response.Result.GetJsonAsync<PaymentApiResponseModel>();
            var paymentFunctionResponse = mapper.Map<PaymentResponseModel>(paymentApiResponse);
            return await request.CreateObjectResponseAsync(paymentFunctionResponse);
        }
    }

    public class PaymentRequestModel
    {
        public int Amount;
        public string Reference;
        public string ReturnLink;
        public string Description;

        public string Email;
        public string CardholderName;
        public string AddressLineOne;
        public string AddressLineTwo;
        public string Postcode;
        public string City;
        public string Country;
    }

}
