using System.Text.Json;
using System.Text.Json.Serialization;
using Azure.Identity;
using Flurl.Http;
using Flurl.Http.Configuration;
using HSEPortal.API;
using HSEPortal.Domain.DynamicsDefinitions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(ConfigureServices)
    .ConfigureAppConfiguration(ConfigureAppConfiguration)
    .Build();

FlurlHttp.Configure(settings => { settings.JsonSerializer = new SystemTextJsonSerializer(); });

host.Run();


static void ConfigureServices(HostBuilderContext builderContext, IServiceCollection serviceCollection)
{
    serviceCollection.Configure<DynamicsOptions>(builderContext.Configuration.GetSection(DynamicsOptions.Dynamics));

    serviceCollection.AddTransient<DynamicsService>();
    serviceCollection.AddTransient<DynamicsModelDefinitionFactory>();
}

static void ConfigureAppConfiguration(HostBuilderContext builderContext, IConfigurationBuilder builder)
{
    var configuration = builder.Build();
    if (builderContext.HostingEnvironment.IsProduction())
    {
        builder.AddAzureKeyVault(new Uri(configuration["KeyVaultEndpointUri"]), new DefaultAzureCredential());
    }
}

namespace HSEPortal.API
{
    public class SystemTextJsonSerializer : ISerializer
    {
        private readonly JsonSerializerOptions serializerOptions = new()
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNameCaseInsensitive = true
        };

        public string Serialize(object obj)
        {
            return JsonSerializer.Serialize(obj, serializerOptions);
        }

        public T Deserialize<T>(string s)
        {
            return JsonSerializer.Deserialize<T>(s, serializerOptions);
        }

        public T Deserialize<T>(Stream stream)
        {
            return JsonSerializer.Deserialize<T>(stream, serializerOptions);
        }
    }
}