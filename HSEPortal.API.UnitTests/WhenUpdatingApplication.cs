using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.TestingCommon.Builders;
using Xunit;

namespace HSEPortal.API.UnitTests;

public class WhenUpdatingApplication : UnitTestBase
{
    private readonly BuildingApplicationFunctions buildingApplicationFunctions;
    public WhenUpdatingApplication()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService, OtpService);
    }

    [Fact]
    public async Task ShouldSetApplicationOnCosmosDocumentResponse()
    {
        var application = new BuildingApplicationModelBuilder().Build();

        var response = await buildingApplicationFunctions.UpdateApplication(BuildHttpRequestData(data: application, application.Id));

        response.Application.Should().BeEquivalentTo(application);
        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [InlineData(null, "firstname", "lastname", "phone", "email")]
    [InlineData("building", null, "lastname", "phone", "email")]
    [InlineData("building", "firstname", null, "phone", "email")]
    [InlineData("building", "firstname", "lastname", null, "email")]
    [InlineData("building", "firstname", "lastname", "phone", null)]
    public async Task ShouldReturnBadRequestIfInputsAreInvalid(string buildingName, string contactFirstName, string contactLastName, string contactPhone, string contactEmail)
    {
        var application = new BuildingApplicationModel(buildingName, contactFirstName, contactLastName, contactPhone, contactEmail);
        var response = await buildingApplicationFunctions.UpdateApplication(BuildHttpRequestData(data: application, application.Id));

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}