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
        otpService = new OTPService(new OptionsWrapper<IntegrationsOptions>(IntegrationOptions));
        emailVerificationFunction = new EmailVerificationFunction(DynamicsService, otpService, new OptionsWrapper<FeatureOptions>(new FeatureOptions()));
    }

    [Fact]
    public async Task ShouldReturnSuccessIfOTPIsValid()
    {
        HttpTest.RespondWithJson(new { Token = "123123" });
        var token = await otpService.GenerateToken(emailAddress);
        var model = new OTPValidationModel(token, emailAddress);

        var request = BuildHttpRequestData(model);
        HttpTest.RespondWithJson(string.Empty, 200);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task ShouldReturnBadRequestIsOTPIsInvalid()
    {
        HttpTest.RespondWithJson(new { Token = "123123" });
        var token = await otpService.GenerateToken(emailAddress);
        var model = new OTPValidationModel(token, emailAddress);

        var request = BuildHttpRequestData(model);
        HttpTest.RespondWithJson(string.Empty, 400);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task ShouldReturnBadRequestIsOTPIsEmpty(string token)
    {
        HttpTest.RespondWithJson(new { Token = "123123" });
        var model = new OTPValidationModel(token, emailAddress);

        var request = BuildHttpRequestData(model);
        HttpTest.RespondWithJson(string.Empty, 400);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("INVALID_SECRET_KEY")]
    [InlineData("")]
    [InlineData(null)]
    public async Task ShouldReturnBadRequestIsSecretKeyIsInvalid(string secretKey)
    {
        HttpTest.RespondWithJson(new { Token = "123123" });
        var token = await otpService.GenerateToken(emailAddress);
        var model = new OTPValidationModel(token, secretKey);

        var request = BuildHttpRequestData(model);
        HttpTest.RespondWithJson(string.Empty, 400);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task ShouldSetSecretToLowerCase()
    {
        var token = otpService.GenerateToken(emailAddress);
        var model = new OTPValidationModel(token, emailAddress.ToUpper());

        var request = BuildHttpRequestData(model);
        var response = await emailVerificationFunction.ValidateOTPToken(request);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}