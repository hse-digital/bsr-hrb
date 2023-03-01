using System.Net;
using AutoMapper;
using Flurl;
using Flurl.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Functions;

public class SearchCompanyFunctions
{
    private readonly static string API_KEY = "";
    private readonly static string ENDPOINT = "https://api.company-information.service.gov.uk";

    [Function(nameof(SearchCompany))]
    public async Task<HttpResponseData> SearchCompany([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(SearchCompany)}/{{companyName}}")] HttpRequestData request, string companyName)
    {
        string operation = "advanced-search/companies";
        var response = await $"{ENDPOINT}/{operation}"
            .SetQueryParam("company_name_includes", companyName)
            .WithOAuthBearerToken(API_KEY)
            .AllowHttpStatus(HttpStatusCode.BadRequest)
            .GetJsonAsync();
        return response.GetJsonAsync().Result;
    }
}