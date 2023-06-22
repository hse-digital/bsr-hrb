using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Moq;
using Xunit;

namespace HSEPortal.API.UnitTests.EmailVerification;

public class WhenSendingVerificationEmail : UnitTestBase
{
    private EmailVerificationFunction emailVerificationFunction;
    private readonly string otpToken = "123456";
    private readonly string email = "user@domain.com";

    public WhenSendingVerificationEmail()
    {
        var otpService = Mock.Of<OTPService>(x => x.GenerateToken(It.IsAny<string>(), null, true) == otpToken);
        emailVerificationFunction = new EmailVerificationFunction(DynamicsService, otpService, FeatureOptions);
    }

    [Fact]
    public async Task ShouldCallFlowWithUserEmailAndOTP()
    {
        var emailVerificationModel = new EmailVerificationModel(email);

        var requestData = BuildHttpRequestData(emailVerificationModel);
        await emailVerificationFunction.SendVerificationEmail(requestData);

        HttpTest.ShouldHaveCalled(DynamicsOptions.EmailVerificationFlowUrl)
            .WithRequestJson(new
            {
                emailAddress = emailVerificationModel.EmailAddress,
                otp = otpToken,
            });
    }

    [Fact]
    public async Task ShouldSetEmailToLowerCase()
    {
        var upperCaseEmail = "DsantIN@CODEC.iE";
        var emailVerificationModel = new EmailVerificationModel(upperCaseEmail);

        var requestData = BuildHttpRequestData(emailVerificationModel);
        await emailVerificationFunction.SendVerificationEmail(requestData);

        HttpTest.ShouldHaveCalled(DynamicsOptions.EmailVerificationFlowUrl)
            .WithRequestJson(new
            {
                emailAddress = upperCaseEmail.ToLower(),
                otp = otpToken,
            });
    }

    [Theory]
    [InlineData("abc@")]
    [InlineData("")]
    [InlineData(null)]
    public async Task ShouldReturnBadRequestIfEmailIsInvalid(string emailAddress)
    {
        var emailVerificationModel = new EmailVerificationModel(emailAddress);

        var requestData = BuildHttpRequestData(emailVerificationModel);
        var response = await emailVerificationFunction.SendVerificationEmail(requestData);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}