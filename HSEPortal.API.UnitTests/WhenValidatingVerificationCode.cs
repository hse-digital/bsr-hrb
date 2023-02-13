using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Xunit;

namespace HSEPortal.API.UnitTests;

public class WhenValidatingVerificationCode : UnitTestBase
{
    private readonly EmailVerificationFunction emailVerificationFunction;
    private readonly OTPService otpService;

    public WhenValidatingVerificationCode()
    {
        otpService = new OTPService();
        emailVerificationFunction = new EmailVerificationFunction(DynamicsService, otpService);
    }

    [Fact]
    public async Task ShouldReturnSuccessIfOTPIsValid()
    {
        var token = otpService.GenerateToken();
        var model = new OTPValidationModel(token);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [InlineData(60)]
    [InlineData(120)]
    public async Task ShouldReturnBadRequestIsOTPIsInvalid(int minutesToReduce)
    {
        var token = otpService.GenerateToken(DateTime.UtcNow.AddMinutes(-minutesToReduce));
        var model = new OTPValidationModel(token);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task ShouldReturnBadRequestIsOTPIsEmpty(string token)
    {
        var model = new OTPValidationModel(token);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}