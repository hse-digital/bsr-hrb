using System.Net;
using FluentAssertions;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Model;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.IntegrationTests;

public class WhenGettingApplication : IntegrationTestBase
{
    private readonly IOptions<SwaOptions> swaOptions;
    public WhenGettingApplication(IOptions<SwaOptions> swaOptions)
    {
        this.swaOptions = swaOptions;
    }

    [Fact]
    public async Task ShouldReturnApplicationFromCosmos()
    {
        var applicationId = "HBR170597960";
        var response = await swaOptions.Value.Url.AppendPathSegments("api", "GetApplication", applicationId).GetJsonAsync<BuildingApplicationModel>();

        response.Id.Should().Be(applicationId);
    }

    [Fact]
    public async Task ShouldReturnBadRequestIfApplicationIdIsInvalid()
    {
        var response = await swaOptions.Value.Url.AppendPathSegments("api", "GetApplication", "DOESNT_EXIST")
            .AllowAnyHttpStatus().GetAsync();
        
        response.StatusCode.Should().Be((int)HttpStatusCode.BadRequest);
    }
}