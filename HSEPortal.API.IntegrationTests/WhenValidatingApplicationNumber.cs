using System.Net;
using FluentAssertions;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.IntegrationTests;

public class WhenValidatingApplicationNumber : IntegrationTestBase
{
    private readonly IOptions<SwaOptions> swaOptions;

    public WhenValidatingApplicationNumber(IOptions<SwaOptions> swaOptions)
    {
        this.swaOptions = swaOptions;
    }

    [Theory]
    [InlineData("HBR170597960", "dont@delete.com", HttpStatusCode.OK)]
    [InlineData("DOESNT-EXIST", "DOESNT-EXIST", HttpStatusCode.BadRequest)]
    public async Task ShouldReturnApplicationExistsBasedOnNumberAndEmailAddress(string applicationNumber, string emailAddress, HttpStatusCode expectedResponse)
    {
        var response = await swaOptions.Value.Url.AppendPathSegments("api", "ValidateApplicationNumber", applicationNumber, emailAddress)
            .AllowAnyHttpStatus().GetAsync();

        response.StatusCode.Should().Be((int)expectedResponse);
    }
}