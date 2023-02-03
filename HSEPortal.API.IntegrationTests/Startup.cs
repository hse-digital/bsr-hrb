using HSEPortal.Domain.DynamicsDefinitions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace HSEPortal.API.IntegrationTests;

public class Startup
{
    public void ConfigureServices(IServiceCollection services, HostBuilderContext context)
    {
        var config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables()
            .Build();

        services.Configure<DynamicsOptions>(config.GetSection(DynamicsOptions.Dynamics));
        services.Configure<SwaOptions>(config.GetSection(SwaOptions.Swa));

        services.AddTransient<DynamicsService>();
        services.AddTransient<DynamicsModelDefinitionFactory>();
    }
}