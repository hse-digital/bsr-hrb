using System.Net;
using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.TestingCommon.Builders;
using Xunit;

namespace HSEPortal.API.UnitTests;

public class WhenGettingApplication : UnitTestBase
{
    private readonly BuildingApplicationFunctions buildingApplicationFunctions;
    private readonly string applicationId = "HBR123456789012";

    public WhenGettingApplication()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService);
    }

    [Fact]
    public async Task ShouldReturnApplicationFromCosmos()
    {
        var cosmosApplication = new BuildingApplicationModelBuilder().WithApplicationId(applicationId).Build();
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestDataWithParameters(applicationId), new List<BuildingApplicationModel> { cosmosApplication });

        applicationResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var responseApplication = await applicationResponse.ReadAsJsonAsync<BuildingApplicationModel>();

        responseApplication.Should().BeEquivalentTo(cosmosApplication);
    }

    [Fact]
    public async Task ShouldReturnBadRequestIfApplicationIdIsInvalid()
    {
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestDataWithParameters(applicationId), new List<BuildingApplicationModel>());
        applicationResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}