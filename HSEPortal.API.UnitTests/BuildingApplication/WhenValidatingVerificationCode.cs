using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.UnitTests.BuildingApplication;

public class WhenValidatingVerificationCode : UnitTestBase
{
    private EmailVerificationFunction emailVerificationFunction;
    private readonly OTPService otpService;
    private readonly string emailAddress = "email@domain.com";

    public WhenValidatingVerificationCode()
    {
        otpService = new OTPService();
        emailVerificationFunction = new EmailVerificationFunction(DynamicsService, otpService, new OptionsWrapper<FeatureOptions>(new FeatureOptions()));
    }

    [Fact]
    public async Task ShouldReturnSuccessIfOTPIsValid()
    {
        var token = otpService.GenerateToken(emailAddress);
        var model = new OTPValidationModel(token, emailAddress);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task ShouldReturnSuccessIfOTPValidationIsDisabled()
    {
        emailVerificationFunction = new EmailVerificationFunction(DynamicsService, otpService, new OptionsWrapper<FeatureOptions>(new FeatureOptions { DisableOtpValidation = true }));

        var model = new OTPValidationModel("invalid token", emailAddress);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [InlineData(60)]
    [InlineData(120)]
    public async Task ShouldReturnBadRequestIsOTPIsInvalid(int minutesToReduce)
    {
        var token = otpService.GenerateToken(emailAddress, DateTime.UtcNow.AddMinutes(-minutesToReduce));
        var model = new OTPValidationModel(token, emailAddress);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task ShouldReturnBadRequestIsOTPIsEmpty(string token)
    {
        var model = new OTPValidationModel(token, emailAddress);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("INVALID_SECRET_KEY")]
    [InlineData("")]
    [InlineData(null)]
    public async Task ShouldReturnBadRequestIsSecretKeyIsInvalid(string secretKey)
    {
        var token = otpService.GenerateToken(emailAddress);
        var model = new OTPValidationModel(token, secretKey);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}