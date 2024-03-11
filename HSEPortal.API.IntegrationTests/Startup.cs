using HSEPortal.API.Services;
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
            .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables()
            .Build();

        services.Configure<DynamicsOptions>(config.GetSection(DynamicsOptions.Dynamics));
        services.Configure<IntegrationsOptions>(config.GetSection(IntegrationsOptions.Integrations));
        services.Configure<SwaOptions>(config.GetSection(SwaOptions.Swa));

        services.AddTransient<DynamicsService>();
        services.AddTransient<DynamicsService>();
        services.AddTransient<DynamicsApi>();
        services.AddTransient<OTPService>();
        services.AddTransient<DynamicsModelDefinitionFactory>();
    }
}