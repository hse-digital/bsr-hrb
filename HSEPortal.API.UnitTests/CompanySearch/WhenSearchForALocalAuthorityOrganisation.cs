using AutoMapper;
using Azure;
using Azure.Core;
using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace HSEPortal.API.UnitTests.CompanySearch;

public class WhenSearchForALocalAuthorityOrganisation : UnitTestBase
{
    private readonly CompanySearchFunctions companySearchFunctions;
    private const string DynamicsAuthToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkd";
    private readonly IntegrationsOptions integrationsOptions;

    public WhenSearchForALocalAuthorityOrganisation()
    {
        integrationsOptions = new IntegrationsOptions { CompaniesHouseEndpoint = "https://api.company-information.service.gov.uk", CompaniesHouseApiKey = "123" };
        companySearchFunctions = new CompanySearchFunctions(new CompanySearchService(DynamicsService, new OptionsWrapper<IntegrationsOptions>(integrationsOptions), GetMapper()));
     
        HttpTest.RespondWithJson(new DynamicsAuthenticationModel { AccessToken = DynamicsAuthToken }); 
    }

    [Fact]
    public async Task ShouldCallSearchLocalAuthorityCompanyFunctionToSearchForNames()
    {
        var dynamicsLocalAuthorityRequestModel = CreateDynamicsLocalAuthorityResponseModel();

        HttpTest.RespondWithJson(dynamicsLocalAuthorityRequestModel);

        HttpRequestData request = BuildHttpRequestData(new object(), new Parameter[] {
            new Parameter() { Key = "companyType", Value = "local-authority" },
            new Parameter() { Key = "company", Value = "test" }
        });

        var response = await companySearchFunctions.SearchCompany(request);

        var localAuthorityResponseModel = await response.ReadAsJsonAsync<LocalAuthority>();

        HttpTest.ShouldHaveMadeACall().WithOAuthBearerToken(DynamicsAuthToken);

        localAuthorityResponseModel.context.Should().Be(dynamicsLocalAuthorityRequestModel.context);
        localAuthorityResponseModel.value.First().etag.Should().Be(dynamicsLocalAuthorityRequestModel.value.First().etag);
        localAuthorityResponseModel.value.First().name.Should().Be(dynamicsLocalAuthorityRequestModel.value.First().name);
        localAuthorityResponseModel.value.First().accountid.Should().Be(dynamicsLocalAuthorityRequestModel.value.First().accountid);
        localAuthorityResponseModel.value.ElementAt(1).etag.Should().Be(dynamicsLocalAuthorityRequestModel.value.ElementAt(1).etag);
        localAuthorityResponseModel.value.ElementAt(1).name.Should().Be(dynamicsLocalAuthorityRequestModel.value.ElementAt(1).name);
        localAuthorityResponseModel.value.ElementAt(1).accountid.Should().Be(dynamicsLocalAuthorityRequestModel.value.ElementAt(1).accountid);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public async Task ShouldNOTCallSearchLocalAuthorityCompanyFunction(string name)
    {
        HttpRequestData request = BuildHttpRequestData(new object(), new Parameter[] {
            new Parameter() { Key = "companyType", Value = "local-authority" },
            new Parameter() { Key = "company", Value = name }
        });

        var response = await companySearchFunctions.SearchCompany(request);
        
        HttpTest.ShouldNotHaveMadeACall();
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }


    private DynamicsLocalAuthority CreateDynamicsLocalAuthorityResponseModel()
    {
        return new DynamicsLocalAuthority(
            "context",
            new DynamicsLocalAuthorityValue[] {
                new DynamicsLocalAuthorityValue("etag1", "name1", "id1"),
                new DynamicsLocalAuthorityValue("etag2", "name2", "id2")
            });
    }

}
