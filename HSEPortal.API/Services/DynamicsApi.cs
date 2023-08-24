using System.Net;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Model;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Retry;

namespace HSEPortal.API.Services;

public class DynamicsApi
{
    private readonly DynamicsOptions dynamicsOptions;
    private readonly AsyncRetryPolicy retryPolicy;

    public DynamicsApi(IOptions<DynamicsOptions> dynamicsOptions)
    {
        retryPolicy = Policy
            .Handle<FlurlHttpException>()
            .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));
        this.dynamicsOptions = dynamicsOptions.Value;
    }

    public async Task<IFlurlResponse> Create(string endpoint, object entity, bool returnObjectResponse = false)
    {
        return await retryPolicy.ExecuteAsync(async () =>
        {
            var token = await GetAuthenticationTokenAsync();

            var request = dynamicsOptions.EnvironmentUrl
                .AppendPathSegments("api", "data", "v9.2", endpoint)
                .WithOAuthBearerToken(token);

            if (returnObjectResponse)
            {
                request = request.WithHeader("Prefer", "return=representation");
            }

            return await request.PostJsonAsync(entity);
        });
    }

    public async Task<IFlurlResponse> Update(string endpoint, object entity)
    {
        return await retryPolicy.ExecuteAsync(async () =>
        {
            var token = await GetAuthenticationTokenAsync();

            return await dynamicsOptions.EnvironmentUrl
                .AppendPathSegments("api", "data", "v9.2", endpoint)
                .WithOAuthBearerToken(token)
                .PatchJsonAsync(entity);
        });
    }

    public async Task<T> Get<T>(string endpoint, params (string, string)[] filters)
    {
        return await retryPolicy.ExecuteAsync(async () =>
        {
            var token = await GetAuthenticationTokenAsync();

            var request = dynamicsOptions.EnvironmentUrl
                .AppendPathSegments("api", "data", "v9.2", endpoint)
                .WithOAuthBearerToken(token);

            request = filters.Aggregate(request, (current, filter) => current.SetQueryParam(filter.Item1, filter.Item2));

            return await request.GetJsonAsync<T>();
        });
    }

    internal async Task<string> GetAuthenticationTokenAsync()
    {
        var response = await $"https://login.microsoftonline.com/{dynamicsOptions.TenantId}/oauth2/token"
            .PostUrlEncodedAsync(new
            {
                grant_type = "client_credentials",
                client_id = dynamicsOptions.ClientId,
                client_secret = dynamicsOptions.ClientSecret,
                resource = dynamicsOptions.EnvironmentUrl
            })
            .ReceiveJson<DynamicsAuthenticationModel>();

        return response.AccessToken;
    }

    public async Task Delete(string path)
    {
        var token = await GetAuthenticationTokenAsync();

        await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", path)
            .WithOAuthBearerToken(token)
            .DeleteAsync();
    }
}