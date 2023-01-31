using HSEPortal.API;
using HSEPortal.API.Dynamics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((_, collection) => ConfigureServices(collection))
    .Build();

host.Run();


static void ConfigureServices(IServiceCollection serviceCollection)
{
    serviceCollection.AddTransient<DynamicsService>();
    serviceCollection.AddTransient<DynamicsModelDefinitionFactory>();
}