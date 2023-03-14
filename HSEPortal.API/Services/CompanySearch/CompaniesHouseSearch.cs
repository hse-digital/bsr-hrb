using AutoMapper;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Model;
using HSEPortal.API.Model.CompaniesHouse;

namespace HSEPortal.API.Services.CompanySearch;

public class CompaniesHouseSearch : ISearchCompany
{
    private readonly IntegrationsOptions integrationsOptions;
    private readonly IMapper mapper;

    public CompaniesHouseSearch(IntegrationsOptions integrationsOptions, IMapper mapper)
    {
        this.integrationsOptions = integrationsOptions;
        this.mapper = mapper;
    }

    public async Task<CompanySearchResponse> SearchCompany(string company)
    {
        var response = await integrationsOptions.CompaniesHouseEndpoint
            .AppendPathSegments("advanced-search", "companies")
            .SetQueryParam("company_name_includes", company)
            .WithBasicAuth(integrationsOptions.CompaniesHouseApiKey, string.Empty)
            .GetJsonAsync<CompaniesHouseSearchResponse>();

        return mapper.Map<CompanySearchResponse>(response);
    }
}