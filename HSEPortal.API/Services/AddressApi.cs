using Flurl.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSEPortal.API.Services
{
    public class AddressApi
    {
        private const string API_KEY = "fPaSsYzfdvNhUwwV8r36LexwkqMsk15A";

        public async Task<dynamic> SearchBuildingByPostcode(string postcode)
        {
            var result = await $"https://api.os.uk/search/places/v1/postcode?postcode={postcode}&dataset=LPI&key={API_KEY}&fq=CLASSIFICATION_CODE:PP"
                .GetJsonAsync().Result;
            return result;
        }

        public async Task<dynamic> SearchPostalAddressByPostcode(string postcode)
        {
            var result = await $"https://api.os.uk/search/places/v1/postcode?postcode={postcode}&dataset=DPA&key={API_KEY}"
                .GetJsonAsync().Result;
            return result;
        }

        public async Task<dynamic> SearchAddress(string query)
        {
            var result = await $"https://api.os.uk/search/places/v1/find?query={query}&dataset=LPI&key={API_KEY}&fq=CLASSIFICATION_CODE:PP"
                .GetJsonAsync().Result;
            return result;
        }

    }

}
