using System.Net;
using System.Text;
using Flurl;
using Flurl.Http;
using Microsoft.Extensions.Options;
using OtpNet;

namespace HSEPortal.API.Services;

public class OTPService
{
    private readonly IntegrationsOptions integrationsOptions;

    public OTPService(IOptions<IntegrationsOptions> integrationsOptions)
    {
        this.integrationsOptions = integrationsOptions.Value;
    }

    public async Task<string> GenerateToken(string secretKey)
    {
        var response = await integrationsOptions.CommonAPIEndpoint
            .AppendPathSegments("api", "GenerateToken")
            .WithHeader("x-functions-key", integrationsOptions.CommonAPIKey)
            .PostJsonAsync(new
            {
                TokenData = secretKey
            })
            .ReceiveJson<TokenResponse>();

        return response.Token;
    }

    public async Task<bool> ValidateToken(string otpToken, string secretKey, bool forceLowerCase = true)
    {
        var response = await integrationsOptions.CommonAPIEndpoint
            .AppendPathSegments("api", "ValidateToken")
            .WithHeader("x-functions-key", integrationsOptions.CommonAPIKey)
            .AllowAnyHttpStatus()
            .PostJsonAsync(new
            {
                Token = otpToken,
                TokenData = secretKey
            });

        return response.StatusCode == (int)HttpStatusCode.OK;
    } 
}

public record TokenResponse(string Token);