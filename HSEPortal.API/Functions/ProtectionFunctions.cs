using System.Net;
using System.Reflection;
using HSEPortal.API.Extensions;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Functions;

public record FeaturePasswordRequest(string Name, string Password = null);

public class ProtectionFunctions(IOptions<FeatureOptions> featureOptions)
{
    private readonly FeatureOptions featureOptions = featureOptions.Value;

    [Function(nameof(IsFeatureProtected))]
    public async Task<HttpResponseData> IsFeatureProtected([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData requestData)
    {
        var passwordRequest = await requestData.ReadAsJsonAsync<FeaturePasswordRequest>();
        var password = GetPasswordFromFeatureOptions(passwordRequest.Name);

        return await requestData.CreateObjectResponseAsync(!string.IsNullOrEmpty(password));
    }

    [Function(nameof(ValidateFeaturePassword))]
    public async Task<HttpResponseData> ValidateFeaturePassword([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData requestData)
    {
        var passwordRequest = await requestData.ReadAsJsonAsync<FeaturePasswordRequest>();
        var password = GetPasswordFromFeatureOptions(passwordRequest.Name);
        var isPasswordCorrect = password == null || passwordRequest.Password == password;

        return requestData.CreateResponse(isPasswordCorrect ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
    }

    private string GetPasswordFromFeatureOptions(string featureName)
    {
        var type = typeof(FeatureOptions);
        var property = type.GetProperty($"{featureName}Password", BindingFlags.Public | BindingFlags.Instance);
        if (property != null)
        {
            return property.GetValue(featureOptions) as string;
        }

        return null;
    }
}