using AutoMapper;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.CompaniesHouse;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Functions;

public class CompanySearchFunctions
{
    private readonly IMapper mapper;
    private readonly IntegrationsOptions integrationsOptions;

    public CompanySearchFunctions(IOptions<IntegrationsOptions> integrationsOptions, IMapper mapper)
    {
        this.mapper = mapper;
        this.integrationsOptions = integrationsOptions.Value;
    }

    [Function(nameof(SearchCompany))]
    public async Task<HttpResponseData> SearchCompany([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(SearchCompany)}/{{companyName}}")] HttpRequestData request, string companyName)
    {
        var response = await integrationsOptions.CompaniesHouseEndpoint
            .AppendPathSegments("advanced-search", "companies")
            .SetQueryParam("company_name_includes", companyName)
            .WithBasicAuth(integrationsOptions.CompaniesHouseApiKey, string.Empty)
            .GetJsonAsync<CompaniesHouseSearchResponse>();

        var companySearchResponse = mapper.Map<CompanySearchResponse>(response);
        return await request.CreateObjectResponseAsync(companySearchResponse);
    }
}