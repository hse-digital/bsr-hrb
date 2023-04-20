using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Moq;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests.EmailVerification;

public class WhenSendingVerificationEmail : UnitTestBase
{
    private EmailVerificationFunction emailVerificationFunction;
    private readonly string otpToken = "123456";
    private readonly string email = "user@domain.com";

    protected override void AdditionalSetup()
    {
        var otpService = Mock.Of<OTPService>(x => x.GenerateToken(email, null) == otpToken);
        emailVerificationFunction = new EmailVerificationFunction(DynamicsService, otpService, FeatureOptions);
    }

    [Test]
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

    [TestCase("abc@")]
    [TestCase("")]
    [TestCase(null)]
    public async Task ShouldReturnBadRequestIfEmailIsInvalid(string emailAddress)
    {
        var emailVerificationModel = new EmailVerificationModel(emailAddress);

        var requestData = BuildHttpRequestData(emailVerificationModel);
        var response = await emailVerificationFunction.SendVerificationEmail(requestData);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}