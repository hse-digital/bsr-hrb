using System.Net;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Functions;

public class EmailVerificationFunction 
{
    private readonly DynamicsService dynamicsService;
    private readonly OTPService otpService;

    public EmailVerificationFunction(DynamicsService dynamicsService, OTPService otpService)
    {
        this.dynamicsService = dynamicsService;
        this.otpService = otpService;
    }

    [Function(nameof(SendVerificationEmail))]
    public async Task<CustomHttpResponseData> SendVerificationEmail([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var emailVerificationModel = await request.ReadAsJsonAsync<EmailVerificationModel>();
        var validation = emailVerificationModel.Validate();
        if (!validation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(validation);
        }

        var otpToken = otpService.GenerateToken(emailVerificationModel.EmailAddress);

        await dynamicsService.SendVerificationEmail(emailVerificationModel, otpToken);
        return new CustomHttpResponseData
        {
            HttpResponse = request.CreateResponse()
        };
    }

    [Function(nameof(ValidateOTPToken))]
    public async Task<CustomHttpResponseData> ValidateOTPToken([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var otpValidationModel = await request.ReadAsJsonAsync<OTPValidationModel>();
        var isTokenValid = otpValidationModel.Validate().IsValid && otpService.ValidateToken(otpValidationModel.OTPToken, otpValidationModel.EmailAddress);

        var returnStatusCode = HttpStatusCode.OK;
        if (!isTokenValid)
        {
            returnStatusCode = HttpStatusCode.BadRequest;
        }

        return new CustomHttpResponseData
        {
            HttpResponse = request.CreateResponse(returnStatusCode)
        };
    }
}