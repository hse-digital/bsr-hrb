using FluentAssertions;
using Flurl.Http.Testing;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace HSEPortal.API.UnitTests.CompanySearch;

public class WhenSearchForSocialHousing : UnitTestBase
{
    private readonly CompanySearchFunctions companySearchFunctions;
    private readonly IntegrationsOptions integrationsOptions;

    public WhenSearchForSocialHousing()
    {
        integrationsOptions = new IntegrationsOptions() { SocialHousingFilePath = "abcd1234" };

        var fileReaderServiceMock = this.GetFileReaderServiceMock();
        
        companySearchFunctions = new CompanySearchFunctions(new CompanySearchService(DynamicsService, new OptionsWrapper<IntegrationsOptions>(integrationsOptions), GetMapper(), fileReaderServiceMock ));
    }

    [Fact]
    public async Task ShouldGetSocialHousingOrganisationNames()
    {
        string[] expectedResponse = BuildResponseJson();

        HttpRequestData request = BuildHttpRequestData(new object(), new Parameter[] {
            new Parameter() { Key = "companyType", Value = "social-housing" },
            new Parameter() { Key = "company", Value = "aaa" }
        });

        var response = await companySearchFunctions.SearchCompany(request);

        SocialHousingResponse result = await response.ReadAsJsonAsync<SocialHousingResponse>();

        Assert.Equal(expectedResponse.Length, result.SocialHousingNames.Length);
        Assert.Contains(expectedResponse[0], result.SocialHousingNames);
        Assert.Contains(expectedResponse[1], result.SocialHousingNames);
        Assert.Contains(expectedResponse[2], result.SocialHousingNames);
    }


    private string[] BuildResponseJson()
    {
        return new string[] {
            "aaa bbb ccc ddd",
            "aaa abc ccc",
            "bbb aaa"
        };
    }

    private IFileReaderService GetFileReaderServiceMock()
    {
        var fileReaderServiceMock = new Mock<IFileReaderService>();

        fileReaderServiceMock.Setup(x => x.DeserializeJsonFile<SocialHousing[]>(null))
                             .Returns(new SocialHousing[] {
            new SocialHousing() { organisation_name = "aaa bbb ccc ddd" },
            new SocialHousing() { organisation_name = "aaa abc ccc" },
            new SocialHousing() { organisation_name = "bbb ccc ddd" },
            new SocialHousing() { organisation_name = "bbb aaa" },
            new SocialHousing() { organisation_name = "ccc" },
        });

        fileReaderServiceMock.Setup(x => x.GetFileStream(""))
                             .Returns(() => null);

        return fileReaderServiceMock.Object;
    }
}
