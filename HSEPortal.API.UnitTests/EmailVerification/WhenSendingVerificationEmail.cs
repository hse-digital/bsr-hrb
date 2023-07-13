using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using Xunit;

namespace HSEPortal.API.UnitTests.EmailVerification;

public class WhenSendingVerificationEmail : UnitTestBase
{
    private EmailVerificationFunction emailVerificationFunction;
    private readonly string otpToken = "123456";
    private readonly string email = "user@domain.com";
    private readonly BuildingApplicationModel buildingApplication = new("id", BuildingName: "Building Name");

    public WhenSendingVerificationEmail()
    {
        emailVerificationFunction = new EmailVerificationFunction(DynamicsService, OtpService, FeatureOptions);
        HttpTest.RespondWithJson(new { Token = otpToken });
    }

    [Fact]
    public async Task ShouldCallCommonAPIToGenerateToken()
    {
        var emailVerificationModel = new EmailVerificationModel(email, buildingApplication.Id);

        var requestData = BuildHttpRequestData(emailVerificationModel);
        await emailVerificationFunction.SendVerificationEmail(requestData, new List<BuildingApplicationModel> { buildingApplication });

        HttpTest.ShouldHaveCalled($"{IntegrationOptions.CommonAPIEndpoint}/api/GenerateToken")
            .WithHeader("x-functions-key", IntegrationOptions.CommonAPIKey)
            .WithRequestJson(new { TokenData = email });
    }

    [Fact]
    public async Task ShouldCallFlowWithUserEmailAndOTP()
    {
        var emailVerificationModel = new EmailVerificationModel(email, buildingApplication.Id);

        var requestData = BuildHttpRequestData(emailVerificationModel);
        await emailVerificationFunction.SendVerificationEmail(requestData, new List<BuildingApplicationModel> { buildingApplication });

        HttpTest.ShouldHaveCalled(DynamicsOptions.EmailVerificationFlowUrl)
            .WithRequestJson(new { emailAddress = emailVerificationModel.EmailAddress, otp = otpToken, buildingName = buildingApplication.BuildingName });
    }

    [Fact]
    public async Task ShouldSetEmailToLowerCase()
    {
        var upperCaseEmail = "DsantIN@CODEC.iE";
        var emailVerificationModel = new EmailVerificationModel(upperCaseEmail, buildingApplication.Id);

        var requestData = BuildHttpRequestData(emailVerificationModel);
        await emailVerificationFunction.SendVerificationEmail(requestData, new List<BuildingApplicationModel> { buildingApplication });

        HttpTest.ShouldHaveCalled(DynamicsOptions.EmailVerificationFlowUrl)
            .WithRequestJson(new { emailAddress = upperCaseEmail.ToLower(), otp = otpToken, buildingName = buildingApplication.BuildingName });
    }

    [Fact]
    public async Task AndBuildingApplicationIsNullShouldGetBuildingNameFromRequestBody()
    {
        var buildingName = "new building name";
        var emailVerificationModel = new EmailVerificationModel(email, BuildingName: buildingName);

        var requestData = BuildHttpRequestData(emailVerificationModel);
        await emailVerificationFunction.SendVerificationEmail(requestData, new List<BuildingApplicationModel>());

        HttpTest.ShouldHaveCalled(DynamicsOptions.EmailVerificationFlowUrl)
            .WithRequestJson(new { emailAddress = email.ToLower(), otp = otpToken, buildingName = buildingName });
    }

    [Theory]
    [InlineData("abc@")]
    [InlineData("")]
    [InlineData(null)]
    public async Task ShouldReturnBadRequestIfEmailIsInvalid(string emailAddress)
    {
        var emailVerificationModel = new EmailVerificationModel(emailAddress, buildingApplication.Id);

        var requestData = BuildHttpRequestData(emailVerificationModel);
        var response = await emailVerificationFunction.SendVerificationEmail(requestData, new List<BuildingApplicationModel> { buildingApplication });

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}