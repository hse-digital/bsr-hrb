using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.TestingCommon.Builders;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.UnitTests.BuildingApplication;

public class WhenUpdatingApplication : UnitTestBase
{
    private readonly BuildingApplicationFunctions buildingApplicationFunctions;
    public WhenUpdatingApplication()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService, OtpService, FeatureOptions, new OptionsWrapper<IntegrationsOptions>(IntegrationOptions));
    }

    [Fact]
    public async Task ShouldSetApplicationOnCosmosDocumentResponse()
    {
        var application = new BuildingApplicationModelBuilder().Build();

        var response = await buildingApplicationFunctions.UpdateApplication(BuildHttpRequestData(data: application, application.Id));

        response.Application.Should().BeEquivalentTo(application);
        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}