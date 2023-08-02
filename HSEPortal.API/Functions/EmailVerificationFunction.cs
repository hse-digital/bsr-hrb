using System.Net;
using System.Net.Mail;
using System.Text.RegularExpressions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Functions;

public class EmailVerificationFunction
{
    private readonly DynamicsService dynamicsService;
    private readonly OTPService otpService;
    private readonly FeatureOptions featureOptions;

    public EmailVerificationFunction(DynamicsService dynamicsService, OTPService otpService, IOptions<FeatureOptions> featureOptions)
    {
        this.dynamicsService = dynamicsService;
        this.otpService = otpService;
        this.featureOptions = featureOptions.Value;
    }

    [Function(nameof(SendVerificationEmail))]
    public async Task<CustomHttpResponseData> SendVerificationEmail([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", PartitionKey = "{ApplicationNumber}", SqlQuery = "SELECT * FROM c WHERE c.id = {ApplicationNumber}",
            Connection = "CosmosConnection")]
        List<BuildingApplicationModel> buildingApplications)
    {
        var emailVerificationModel = await request.ReadAsJsonAsync<EmailVerificationModel>();
        var validation = emailVerificationModel.Validate();
        if (!validation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(validation);
        }

        var otpToken = await otpService.GenerateToken(emailVerificationModel.EmailAddress);

        var buildingName = buildingApplications.FirstOrDefault()?.BuildingName ?? emailVerificationModel.BuildingName;
        await dynamicsService.SendVerificationEmail(emailVerificationModel.EmailAddress, buildingName, otpToken);
        return new CustomHttpResponseData { HttpResponse = request.CreateResponse() };
    }

    public ValidationSummary ValidateKey(string key)
    {
        var errors = new List<string>();
        if (key != "e55cb4f7-5036-4fb9-b15b-102df960089f")
        {
            errors.Add("Invalid Test key");
        }

        return new ValidationSummary(!errors.Any(), errors.ToArray());
    }

    
    [Function(nameof(GetOTPToken))]
    public async Task<CustomHttpResponseData> GetOTPToken([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request)
    {
        var keyValidation = ValidateKey(request.GetQueryParameters()["key"]);
        if (!keyValidation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(keyValidation);
        }

        var emailVerificationModel = new EmailVerificationModel(request.GetQueryParameters()["email"]);
        var validation = emailVerificationModel.Validate();
        if (!validation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(validation);
        }

        var otpToken = await otpService.GenerateToken(emailVerificationModel.EmailAddress);

        return new CustomHttpResponseData { HttpResponse = await request.CreateObjectResponseAsync(new { OTPCode = otpToken }) };
    }

    [Function(nameof(ValidateOTPToken))]
    public async Task<CustomHttpResponseData> ValidateOTPToken([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var otpValidationModel = await request.ReadAsJsonAsync<OTPValidationModel>();
        var returnStatusCode = HttpStatusCode.BadRequest;

        if (otpValidationModel.Validate().IsValid)
        {
            var tokenIsValid = await otpService.ValidateToken(otpValidationModel.OTPToken, otpValidationModel.EmailAddress);
            if (tokenIsValid)
            {
                returnStatusCode = HttpStatusCode.OK;
            }
        }

        return new CustomHttpResponseData { HttpResponse = request.CreateResponse(returnStatusCode) };
    }
}