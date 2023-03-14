using System.Net;
using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Model.CompaniesHouse;
using HSEPortal.API.Model.LocalAuthority;
using HSEPortal.API.Model.SocialHousing;
using HSEPortal.API.Services;
using HSEPortal.API.Services.CompanySearch;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.UnitTests.CompanySearch;

public class WhenSearchingForACompany : UnitTestBase
{
    private readonly CompanySearchFunctions companySearchFunctions;
    private readonly IntegrationsOptions integrationsOptions;
    private const string companyName = "hse";
    private const string DynamicsAuthToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkd";

    public WhenSearchingForACompany()
    {
        integrationsOptions = new IntegrationsOptions { CompaniesHouseEndpoint = "https://api.company-information.service.gov.uk", CompaniesHouseApiKey = "123" };
        companySearchFunctions = new CompanySearchFunctions(new CompanySearchService(new CompanySearchFactory(new OptionsWrapper<IntegrationsOptions>(integrationsOptions), DynamicsService, GetMapper())));
    }

    [Theory]
    [InlineData("company", null)]
    [InlineData(null, "companyType")]
    public async Task ShouldReturnBadRequestIfCompanyOrCompanyTypeAreNotProvided(string company, string companyType)
    {
        var request = BuildRequestData(company, companyType);
        var response = await companySearchFunctions.SearchCompany(request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("commonhold-association")]
    [InlineData("management-company")]
    [InlineData("rmc-or-organisation")]
    [InlineData("rtm-or-organisation")]
    [InlineData("other")]
    public async Task AndCompanyTypeIsCompaniesHouseShouldCallEndpointToSearchForCompany(string companyType)
    {
        var companiesHouseSearchResponse = BuildCompaniesHouseResponseJson();
        HttpTest.RespondWithJson(companiesHouseSearchResponse);

        var request = BuildRequestData(companyName, companyType);
        var response = await companySearchFunctions.SearchCompany(request);

        HttpTest.ShouldHaveCalled($"{integrationsOptions.CompaniesHouseEndpoint}/advanced-search/companies")
            .WithQueryParam("company_name_includes", companyName)
            .WithBasicAuth(integrationsOptions.CompaniesHouseApiKey, string.Empty)
            .WithVerb(HttpMethod.Get);

        var companySearchResponse = await response.ReadAsJsonAsync<CompanySearchResponse>();
        companySearchResponse.Results.Should().Be(companiesHouseSearchResponse.hits);

        companySearchResponse.Companies.Count.Should().Be(companiesHouseSearchResponse.items.Count);
        companySearchResponse.Companies[0].Name.Should().Be(companiesHouseSearchResponse.items[0].company_name);
        companySearchResponse.Companies[0].Number.Should().Be(companiesHouseSearchResponse.items[0].company_number);
        companySearchResponse.Companies[0].Type.Should().Be(companiesHouseSearchResponse.items[0].company_type);
        companySearchResponse.Companies[0].Status.Should().Be(companiesHouseSearchResponse.items[0].company_status);
    }

    [Fact]
    public async Task AndCompanyTypeIsCompaniesHouseAndCompanyIsNotFoundShouldReturnEmptyResults()
    {
        HttpTest.RespondWith(status: 404);
        
        var request = BuildRequestData(companyName, "management-company");
        var response = await companySearchFunctions.SearchCompany(request);
        
        var companySearchResponse = await response.ReadAsJsonAsync<CompanySearchResponse>();
        companySearchResponse.Results.Should().Be(0);
        companySearchResponse.Companies.Count.Should().Be(0);
    }

    [Fact]
    public async Task AndCompanyTypeIsLocalAuthorityShouldCallEndpointToSearchForCompany()
    {
        var localAuthoritySearchResponse = BuildLocalAuthorityResponseJson();
        HttpTest.RespondWithJson(new DynamicsAuthenticationModel { AccessToken = DynamicsAuthToken });
        HttpTest.RespondWithJson(localAuthoritySearchResponse);

        var request = BuildRequestData(companyName, "local-authority");
        var response = await companySearchFunctions.SearchCompany(request);

        HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/accounts")
            .WithQueryParam("$filter", $"_bsr_accounttype_accountid_value eq '{DynamicsOptions.LocalAuthorityTypeId}' and contains(name, '{companyName}')")
            .WithQueryParam("$select", "name")
            .WithOAuthBearerToken(DynamicsAuthToken)
            .WithVerb(HttpMethod.Get);

        var companySearchResponse = await response.ReadAsJsonAsync<CompanySearchResponse>();
        companySearchResponse.Results.Should().Be(localAuthoritySearchResponse.value.Length);

        companySearchResponse.Companies.Count.Should().Be(localAuthoritySearchResponse.value.Length);
        companySearchResponse.Companies[0].Name.Should().Be(localAuthoritySearchResponse.value[0].name);
        companySearchResponse.Companies[0].Number.Should().Be(localAuthoritySearchResponse.value[0].accountid);
    }

    [Fact]
    public async Task AndCompanyTypeIsHousingAssociationShouldReturnCompanyFromFixedDataset()
    {
        var expectedCompanyRecord = SocialHousingDataset.Records[0];
        
        var request = BuildRequestData(expectedCompanyRecord.organisation_name, "housing-association");
        var response = await companySearchFunctions.SearchCompany(request);
        
        var companySearchResponse = await response.ReadAsJsonAsync<CompanySearchResponse>();
        
        companySearchResponse.Results.Should().Be(1);
        companySearchResponse.Companies[0].Name.Should().Be(expectedCompanyRecord.organisation_name);
        companySearchResponse.Companies[0].Type.Should().Be(expectedCompanyRecord.designation);
        companySearchResponse.Companies[0].Number.Should().Be(expectedCompanyRecord.registration_number);
    }

    private CompaniesHouseSearchResponse BuildCompaniesHouseResponseJson()
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

    private LocalAuthoritiesSearchResponse BuildLocalAuthorityResponseJson()
    {
        return new LocalAuthoritiesSearchResponse(new LocalAuthority[]
        {
            new("name1", "id1"),
            new("name2", "id2")
        });
    }

    private HttpRequestData BuildRequestData(string company, string companyType)
    {
        return BuildHttpRequestData(new object(), new Parameter[]
        {
            new() { Key = "companyType", Value = companyType },
            new() { Key = "company", Value = company }
        });
    }
}