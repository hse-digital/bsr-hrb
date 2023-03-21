using System.Net;
using HSEPortal.API.Extensions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using HSEPortal.API.Services.CompanySearch;

namespace HSEPortal.API.Functions;

public class CompanySearchFunctions
{
    private readonly CompanySearchService companySearchService;

    public CompanySearchFunctions(CompanySearchService companySearchService)
    {
        this.companySearchService = companySearchService;
    }

    [Function(nameof(SearchCompany))]
    public async Task<HttpResponseData> SearchCompany([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request)
    {
        var parameters = request.GetQueryParameters();
        var companyType = parameters["companyType"];
        var company = parameters["company"];

        if (string.IsNullOrWhiteSpace(companyType) || string.IsNullOrWhiteSpace(company))
            return request.CreateResponse(HttpStatusCode.BadRequest);

        var companyResponse = await companySearchService.SearchCompany(companyType, company);
        return await request.CreateObjectResponseAsync(companyResponse);
    }
}