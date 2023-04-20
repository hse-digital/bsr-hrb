using System.Net;
using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.TestingCommon.Builders;
using Microsoft.Extensions.Options;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests.BuildingApplication;

public class WhenGettingApplication : UnitTestBase
{
    private BuildingApplicationFunctions buildingApplicationFunctions;

    private readonly string applicationId = "HBR123456789012";
    private readonly string emailAddress = "email@address.com";

    protected override void AdditionalSetup()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService, OtpService, FeatureOptions);
    }

    [Test]
    public async Task ShouldReturnApplicationFromCosmos()
    {
        var token = OtpService.GenerateToken(emailAddress);
        var cosmosApplication = new BuildingApplicationModelBuilder().WithApplicationId(applicationId).WithContactEmailAddress(emailAddress).Build();
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestData(data: new object(), applicationId, emailAddress, token), new List<BuildingApplicationModel> { cosmosApplication }, token);

        applicationResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var responseApplication = await applicationResponse.ReadAsJsonAsync<BuildingApplicationModel>();

        responseApplication.Should().BeEquivalentTo(cosmosApplication);
    }

    [Test]
    public async Task ShouldReturnBadRequestIfApplicationIdIsInvalid()
    {
        var token = OtpService.GenerateToken(emailAddress);
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestData(data: new object(), applicationId), new List<BuildingApplicationModel>(), token);
        applicationResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Test]
    public async Task ShouldReturnBadRequestIfTokenIsInvalid()
    {
        var invalidToken = "123456";
        var cosmosApplication = new BuildingApplicationModelBuilder().WithApplicationId(applicationId).WithContactEmailAddress(emailAddress).Build();
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestData(data: new object(), applicationId, emailAddress, invalidToken), new List<BuildingApplicationModel> { cosmosApplication }, invalidToken);

        applicationResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Test]
    public async Task ShouldNotValidateTokenIfFeatureIsDisabled()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService, OtpService, new OptionsWrapper<FeatureOptions>(new FeatureOptions { DisableOtpValidation = true }));

        var invalidToken = "123456";
        var cosmosApplication = new BuildingApplicationModelBuilder().WithApplicationId(applicationId).WithContactEmailAddress(emailAddress).Build();
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestData(data: new object(), applicationId, emailAddress, invalidToken), new List<BuildingApplicationModel> { cosmosApplication }, invalidToken);

        applicationResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}