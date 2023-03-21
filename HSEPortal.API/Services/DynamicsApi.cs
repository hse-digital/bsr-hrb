using Flurl;
using Flurl.Http;
using HSEPortal.API.Model;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Services;

public class DynamicsApi
{
    private readonly DynamicsOptions dynamicsOptions;

    public DynamicsApi(IOptions<DynamicsOptions> dynamicsOptions)
    {
        this.dynamicsOptions = dynamicsOptions.Value;
    }

    public async Task<IFlurlResponse> Create(string endpoint, object entity, bool returnObjectResponse = false)
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
    }

    public async Task<IFlurlResponse> Update(string endpoint, object entity)
    {
        var token = await GetAuthenticationTokenAsync();

        return await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", endpoint)
            .WithOAuthBearerToken(token)
            .PatchJsonAsync(entity);
    }

    public async Task<T> Get<T>(string endpoint, params (string, string)[] filters)
    {
        var token = await GetAuthenticationTokenAsync();

        var request = dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", endpoint)
            .WithOAuthBearerToken(token);

        request = filters.Aggregate(request, (current, filter) => current.SetQueryParam(filter.Item1, filter.Item2));

        return await request.GetJsonAsync<T>();
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
}