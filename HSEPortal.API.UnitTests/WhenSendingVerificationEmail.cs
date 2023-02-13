using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Moq;
using Xunit;

namespace HSEPortal.API.UnitTests;

public class WhenSendingVerificationEmail : UnitTestBase
{
    private readonly EmailVerificationFunction emailVerificationFunction;
    private readonly string otpToken = "123456";

    public WhenSendingVerificationEmail()
    {
        var otpService = Mock.Of<OTPService>(x => x.GenerateToken() == otpToken);
        emailVerificationFunction = new EmailVerificationFunction(DynamicsService, otpService);
    }

    [Fact]
    public async Task ShouldCallFlowWithUserEmailAndOTP()
    {
        var emailVerificationModel = new EmailVerificationModel("dsantin@codec.ie");

        var requestData = BuildHttpRequestData(emailVerificationModel);
        await emailVerificationFunction.SendVerificationEmail(requestData);

        HttpTest.ShouldHaveCalled(DynamicsOptions.EmailVerificationFlowUrl)
            .WithRequestJson(new
            {
                emailAddress = emailVerificationModel.EmailAddress,
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