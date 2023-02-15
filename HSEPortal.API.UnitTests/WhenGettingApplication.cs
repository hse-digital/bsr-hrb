using System.Net;
using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.TestingCommon.Builders;
using Xunit;

namespace HSEPortal.API.UnitTests;

public class WhenGettingApplication : UnitTestBase
{
    private readonly BuildingApplicationFunctions buildingApplicationFunctions;
    
    private readonly string applicationId = "HBR123456789012";
    private readonly string emailAddress = "email@address.com";

    public WhenGettingApplication()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService, OtpService);
    }

    [Fact]
    public async Task ShouldReturnApplicationFromCosmos()
    {
        var token = OtpService.GenerateToken(emailAddress);
        var cosmosApplication = new BuildingApplicationModelBuilder().WithApplicationId(applicationId).WithContactEmailAddress(emailAddress).Build();
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestDataWithParameters(applicationId, emailAddress, token), new List<BuildingApplicationModel> { cosmosApplication }, token);

        applicationResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var responseApplication = await applicationResponse.ReadAsJsonAsync<BuildingApplicationModel>();

        responseApplication.Should().BeEquivalentTo(cosmosApplication);
    }

    [Fact]
    public async Task ShouldReturnBadRequestIfApplicationIdIsInvalid()
    {
        var token = OtpService.GenerateToken(emailAddress);
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestDataWithParameters(applicationId), new List<BuildingApplicationModel>(), token);
        applicationResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task ShouldReturnBadRequestIfTokenIsInvalid()
    {
        var invalidToken = "123456";
        var cosmosApplication = new BuildingApplicationModelBuilder().WithApplicationId(applicationId).WithContactEmailAddress(emailAddress).Build();
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestDataWithParameters(applicationId, emailAddress, invalidToken), new List<BuildingApplicationModel> { cosmosApplication }, invalidToken);

        applicationResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}