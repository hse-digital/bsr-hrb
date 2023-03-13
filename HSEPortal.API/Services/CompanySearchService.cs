using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;
using HSEPortal.API.Extensions;
using AutoMapper;
using HSEPortal.API.Model.CompaniesHouse;
using HSEPortal.API.Model;
using Microsoft.Extensions.Options;
using Flurl;
using Flurl.Http;
using System.Net.Http.Headers;

namespace HSEPortal.API.Services;
public class CompanySearchService
{
    private readonly DynamicsService dynamicsService;
    private readonly IMapper mapper;
    private readonly IntegrationsOptions integrationsOptions;


    public CompanySearchService(DynamicsService dynamicsService, IOptions<IntegrationsOptions> integrationsOptions, IMapper mapper) {
        this.dynamicsService = dynamicsService;
        this.mapper = mapper;
        this.integrationsOptions = integrationsOptions.Value;
    }

    public async Task<HttpResponseData> SearchCompany(string type, string company, HttpRequestData request)
    {
        switch(type)
        {
            case "local-authority": return await this.SearchLocalAuthorityCompany(request, company);
            case "social-housing": return await this.SearchLocalHousing(request, company);
        }
        return await this.SearchCompany(request, company);
    }

    private async Task<HttpResponseData> SearchLocalAuthorityCompany(HttpRequestData request, string name)
    {
        if (name == null || name.Equals(string.Empty))
            return request.CreateResponse(HttpStatusCode.BadRequest);

        LocalAuthority localAuthorityModel = await dynamicsService.SearchLocalAuthority(name);

        return await request.CreateObjectResponseAsync(localAuthorityModel);
    }

    private async Task<HttpResponseData> SearchCompany(HttpRequestData request, string name)
    {
        if (name == null || name.Equals(string.Empty))
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var response = await integrationsOptions.CompaniesHouseEndpoint
            .AppendPathSegments("advanced-search", "companies")
            .SetQueryParam("company_name_includes", name)
            .WithBasicAuth(integrationsOptions.CompaniesHouseApiKey, string.Empty)
            .GetJsonAsync<CompaniesHouseSearchResponse>();

        var companySearchResponse = mapper.Map<CompanySearchResponse>(response);
        return await request.CreateObjectResponseAsync(companySearchResponse);
    }

    private async Task<HttpResponseData> SearchLocalHousing(HttpRequestData request, string housingName)
    {
        return null;
    }

}
