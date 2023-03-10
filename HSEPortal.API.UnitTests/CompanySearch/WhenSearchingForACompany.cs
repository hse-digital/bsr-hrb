using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.CompaniesHouse;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.UnitTests.CompanySearch;

public class WhenSearchingForACompany : UnitTestBase
{
    private readonly CompanySearchFunctions companySearchFunctions;
    private readonly IntegrationsOptions integrationsOptions;
    private const string companyName = "hse";

    public WhenSearchingForACompany()
    {
        integrationsOptions = new IntegrationsOptions { CompaniesHouseEndpoint = "https://api.company-information.service.gov.uk", CompaniesHouseApiKey = "123" };
        companySearchFunctions = new CompanySearchFunctions(new OptionsWrapper<IntegrationsOptions>(integrationsOptions), GetMapper(), null);
    }

    [Fact]
    public async Task ShouldCallCompaniesHouseApiToSearchForCompany()
    {
        var companiesResponse = BuildResponseJson();
        HttpTest.RespondWithJson(companiesResponse);
        
        await companySearchFunctions.SearchCompany(BuildHttpRequestData(new object(), companyName), companyName);

        HttpTest.ShouldHaveCalled($"{integrationsOptions.CompaniesHouseEndpoint}/advanced-search/companies")
            .WithQueryParam("company_name_includes", companyName)
            .WithBasicAuth(integrationsOptions.CompaniesHouseApiKey, String.Empty)
            .WithVerb(HttpMethod.Get);
    }

    [Fact]
    public async Task ShouldReturnMatchingCompanies()
    {
        var companiesResponse = BuildResponseJson();
        HttpTest.RespondWithJson(companiesResponse);
        
        var response = await companySearchFunctions.SearchCompany(BuildHttpRequestData(new object(), companyName), companyName);
        var responseCompanies = await response.ReadAsJsonAsync<CompanySearchResponse>();
        
        responseCompanies.Results.Should().Be(companiesResponse.hits);
        
        responseCompanies.Companies[0].Name.Should().Be(companiesResponse.items[0].company_name);
        responseCompanies.Companies[0].Type.Should().Be(companiesResponse.items[0].company_type);
        responseCompanies.Companies[0].Number.Should().Be(companiesResponse.items[0].company_number);
        responseCompanies.Companies[0].Status.Should().Be(companiesResponse.items[0].company_status);
    }

    private CompaniesHouseSearchResponse BuildResponseJson()
    {
        return new CompaniesHouseSearchResponse
        {
            hits = 100,
            items = new List<CompanyItem>
            {
                new()
                {
                    company_name = "HSE LTD",
                    company_number = "NI659373",
                    company_status = "dissolved",
                    company_type = "ltd",
                },
                new()
                {
                    company_name = "HSE SERVICES LIMITED",
                    company_number = "05406216",
                    company_status = "dissolved",
                    company_type = "ltd",
                }
            }
        };
    }
}