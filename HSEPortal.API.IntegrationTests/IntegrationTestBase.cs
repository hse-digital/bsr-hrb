using Flurl.Http;
using Microsoft.Extensions.Configuration;

namespace HSEPortal.API.IntegrationTests;

public abstract class IntegrationTestBase
{
    protected IntegrationTestBase()
    {
        FlurlHttp.Configure(settings => { settings.JsonSerializer = new SystemTextJsonSerializer(); });
    }
}