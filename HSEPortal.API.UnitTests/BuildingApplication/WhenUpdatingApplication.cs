using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.TestingCommon.Builders;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests.BuildingApplication;

public class WhenUpdatingApplication : UnitTestBase
{
    private BuildingApplicationFunctions buildingApplicationFunctions;

    protected override void AdditionalSetup()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService, OtpService, FeatureOptions);
    }

    [Test]
    public async Task ShouldSetApplicationOnCosmosDocumentResponse()
    {
        var application = new BuildingApplicationModelBuilder().Build();

        var response = await buildingApplicationFunctions.UpdateApplication(BuildHttpRequestData(data: application, application.Id));

        response.Application.Should().BeEquivalentTo(application);
        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [TestCase(null, "firstname", "lastname", "phone", "email")]
    [TestCase("building", null, "lastname", "phone", "email")]
    [TestCase("building", "firstname", null, "phone", "email")]
    [TestCase("building", "firstname", "lastname", null, "email")]
    [TestCase("building", "firstname", "lastname", "phone", null)]
    public async Task ShouldReturnBadRequestIfInputsAreInvalid(string buildingName, string contactFirstName, string contactLastName, string contactPhone, string contactEmail)
    {
        var application = new BuildingApplicationModel(buildingName, contactFirstName, contactLastName, contactPhone, contactEmail);
        var response = await buildingApplicationFunctions.UpdateApplication(BuildHttpRequestData(data: application, application.Id));

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}