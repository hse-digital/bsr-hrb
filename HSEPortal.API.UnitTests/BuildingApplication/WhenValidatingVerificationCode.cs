using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Microsoft.Extensions.Options;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests.BuildingApplication;

public class WhenValidatingVerificationCode : UnitTestBase
{
    private EmailVerificationFunction emailVerificationFunction;
    private OTPService otpService;
    private readonly string emailAddress = "email@domain.com";

    protected override void AdditionalSetup()
    {
        otpService = new OTPService();
        emailVerificationFunction = new EmailVerificationFunction(DynamicsService, otpService, new OptionsWrapper<FeatureOptions>(new FeatureOptions()));
    }

    [Test]
    public async Task ShouldReturnSuccessIfOTPIsValid()
    {
        var token = otpService.GenerateToken(emailAddress);
        var model = new OTPValidationModel(token, emailAddress);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Test]
    public async Task ShouldReturnSuccessIfOTPValidationIsDisabled()
    {
        emailVerificationFunction = new EmailVerificationFunction(DynamicsService, otpService, new OptionsWrapper<FeatureOptions>(new FeatureOptions { DisableOtpValidation = true }));

        var model = new OTPValidationModel("invalid token", emailAddress);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [TestCase(60)]
    [TestCase(120)]
    public async Task ShouldReturnBadRequestIsOTPIsInvalid(int minutesToReduce)
    {
        var token = otpService.GenerateToken(emailAddress, DateTime.UtcNow.AddMinutes(-minutesToReduce));
        var model = new OTPValidationModel(token, emailAddress);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [TestCase("")]
    [TestCase(null)]
    public async Task ShouldReturnBadRequestIsOTPIsEmpty(string token)
    {
        var model = new OTPValidationModel(token, emailAddress);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [TestCase("INVALID_SECRET_KEY")]
    [TestCase("")]
    [TestCase(null)]
    public async Task ShouldReturnBadRequestIsSecretKeyIsInvalid(string secretKey)
    {
        var token = otpService.GenerateToken(emailAddress);
        var model = new OTPValidationModel(token, secretKey);

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}