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
using System.Text.Json;

namespace HSEPortal.API.Services;
public class CompanySearchService
{
    private readonly DynamicsService dynamicsService;
    private readonly IMapper mapper;
    private readonly IntegrationsOptions integrationsOptions;
    public IFileReaderService fileReaderService;

    private static SocialHousing[] SocialHousing;


    public CompanySearchService(DynamicsService dynamicsService, IOptions<IntegrationsOptions> integrationsOptions, IMapper mapper, IFileReaderService fileReaderService = null) {
        this.dynamicsService = dynamicsService;
        this.mapper = mapper;
        this.integrationsOptions = integrationsOptions.Value;
        this.fileReaderService = fileReaderService ?? new FileReaderService();

        this.GetSocialHousingValues();
    }

    private void GetSocialHousingValues()
    {
        if (this.integrationsOptions.SocialHousingFilePath == null || this.integrationsOptions.SocialHousingFilePath.Equals(string.Empty)) return;

        FileStream stream = this.fileReaderService.GetFileStream(this.integrationsOptions.SocialHousingFilePath);
        SocialHousing = this.fileReaderService.DeserializeJsonFile<SocialHousing[]>(stream) as SocialHousing[];
    }

    public async Task<HttpResponseData> SearchCompany(string type, string company, HttpRequestData request)
    {
        switch(type)
        {
            case "local-authority": return await this.SearchLocalAuthorityCompany(request, company);
            case "housing-association": return await this.SearchSocialHousing(request, company);
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

    private async Task<HttpResponseData> SearchSocialHousing(HttpRequestData request, string name)
    {
        if (name == null || name.Equals(string.Empty))
            return request.CreateResponse(HttpStatusCode.BadRequest);

        string[] values = SocialHousing.Where(x => x.organisation_name.ToLower().IndexOf(name.ToLower()) > -1)
                                       .Select(x => x.organisation_name)
                                       .ToArray();

        return await request.CreateObjectResponseAsync(new SocialHousingResponse() { SocialHousingNames = values });
    }

}

public class SocialHousingResponse
{
    public string[] SocialHousingNames { get; set; }
}

public class SocialHousing
{
    public string organisation_name { get; set; }
    public string registration_number { get; set; }
    public string registration_date { get; set; }
    public string designation { get; set; }
    public string corporate_form { get; set; }
}
