using System.Net;
using HSEPortal.API.Extensions;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Functions
{
    public class AddressSearchFunctions
    {
        private AddressApi _addressApi = new AddressApi();

        public AddressSearchFunctions()
        {
        }

        [Function("SearchBuildingByPostcode")]
        public async Task<HttpResponseData> SearchBuildingByPostcode([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "AddressSearch/{postcode}")] HttpRequestData request,
            string postcode)
        {
            var addressApiResult = await _addressApi.SearchBuildingByPostcode(postcode);
            
            var addressModel = new AddressModel { Body= addressApiResult };

            return await request.CreateObjectResponseAsync(addressModel);
            
        }

        [Function("SearchPostalAddressByPostcode")]
        public async Task<HttpResponseData> SearchPostalAddressByPostcode([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request,
            string postcode)
        {
            var addressApiResult = await _addressApi.SearchPostalAddressByPostcode(postcode);

            var addressModel = new AddressModel { Body = addressApiResult };

            return await request.CreateObjectResponseAsync(addressModel);
        }

        [Function("SearchAddress")]
        public async Task<HttpResponseData> SearchAddress([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request,
            string query)
        {
            var addressApiResult = await _addressApi.SearchAddress(query);

            var addressModel = new AddressModel { Body = addressApiResult };

            return await request.CreateObjectResponseAsync(addressModel);
        }
    }

    public class AddressModel
    {
        public string Body { get ; set;}
    }

}
