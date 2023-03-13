using AutoMapper;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.CompaniesHouse;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;
using System.Net;
using System.Runtime.CompilerServices;

namespace HSEPortal.API.Functions;

public class CompanySearchFunctions
{
    private readonly CompanySearchService companySearchService;

    public CompanySearchFunctions(CompanySearchService companySearchService)
    {
        this.companySearchService = companySearchService;
    }

    [Function(nameof(SearchCompany))]
    public async Task<HttpResponseData> SearchCompany([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(SearchCompany)}")] HttpRequestData request)
    {
        var parameters = request.GetQueryParameters();
        string companyType = parameters["companyType"];
        string company = parameters["company"];

        if(companyType == null || companyType.Equals(string.Empty) || company == null || company.Equals(string.Empty))
            return request.CreateResponse(HttpStatusCode.BadRequest);

        return await this.companySearchService.SearchCompany(companyType, company, request);
    }

}