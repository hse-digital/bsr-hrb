using System.Net;
using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.TestingCommon.Builders;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.UnitTests.BuildingApplication;

public class WhenGettingApplication : UnitTestBase
{
    private BuildingApplicationFunctions buildingApplicationFunctions;

    private readonly string applicationId = "HBR123456789012";
    private readonly string emailAddress = "email@address.com";

    public WhenGettingApplication()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService, OtpService, FeatureOptions, new OptionsWrapper<IntegrationsOptions>(IntegrationOptions));
    }

    [Fact]
    public async Task ShouldReturnApplicationFromCosmos()
    {
        var token = "123123";
        var cosmosApplication = new BuildingApplicationModelBuilder().WithApplicationId(applicationId).WithContactEmailAddress(emailAddress).Build();
        cosmosApplication = cosmosApplication with
        {
            Versions = new List<BuildingApplicationVersion>
            {
                new("original", Sections: cosmosApplication.Sections, AccountablePersons: cosmosApplication.AccountablePersons, Kbi: cosmosApplication.Kbi)
            },
            Sections = null,
            AccountablePersons = null,
            Kbi = null
        };

        var request = new GetApplicationRequest { ApplicationNumber = applicationId, EmailAddress = emailAddress, OtpToken = token };
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestData(request), new List<BuildingApplicationModel> { cosmosApplication });

        applicationResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var responseApplication = await applicationResponse.ReadAsJsonAsync<BuildingApplicationModel>();

        responseApplication.Should().BeEquivalentTo(cosmosApplication);
    }

    [Fact]
    public async Task ShouldReturnBadRequestIfApplicationIdIsInvalid()
    {
        HttpTest.RespondWithJson(new { Token = "123123" });
        var token = await OtpService.GenerateToken(emailAddress);

        HttpTest.RespondWithJson(string.Empty, 400);

        var request = new GetApplicationRequest { ApplicationNumber = applicationId, OtpToken = token };
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestData(data: request), new List<BuildingApplicationModel>());
        applicationResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task ShouldReturnBadRequestIfTokenIsInvalid()
    {
        var invalidToken = "123456";
        var cosmosApplication = new BuildingApplicationModelBuilder().WithApplicationId(applicationId).WithContactEmailAddress(emailAddress).Build();

        HttpTest.RespondWithJson(string.Empty, 400);

        var request = new GetApplicationRequest { ApplicationNumber = applicationId, EmailAddress = emailAddress, OtpToken = invalidToken };
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestData(data: request), new List<BuildingApplicationModel> { cosmosApplication });

        applicationResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task ShouldNotValidateTokenIfFeatureIsDisabled()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService, OtpService, new OptionsWrapper<FeatureOptions>(new FeatureOptions { DisableOtpValidation = true }),
            new OptionsWrapper<IntegrationsOptions>(IntegrationOptions));

        var invalidToken = "123456";
        var cosmosApplication = new BuildingApplicationModelBuilder().WithApplicationId(applicationId).WithContactEmailAddress(emailAddress).Build();

        var request = new GetApplicationRequest { ApplicationNumber = applicationId, EmailAddress = emailAddress, OtpToken = invalidToken };
        var applicationResponse = await buildingApplicationFunctions.GetApplication(BuildHttpRequestData(data: request), new List<BuildingApplicationModel> { cosmosApplication });

        applicationResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}