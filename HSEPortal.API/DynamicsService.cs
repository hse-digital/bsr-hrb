using Flurl;
using Flurl.Http;
using HSEPortal.API.Dynamics;
using HSEPortal.API.Models;
using Microsoft.Extensions.Configuration;

namespace HSEPortal.API;

public class DynamicsService
{
    private readonly DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory;
    public const string EnvironmentUrlSettingName = "DynamicsEnvironmentUrl";
    private readonly string environmentUrl;

    public DynamicsService(DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory, IConfiguration configuration)
    {
        this.dynamicsModelDefinitionFactory = dynamicsModelDefinitionFactory;
        environmentUrl = configuration[EnvironmentUrlSettingName];
    }

    public async Task SaveRecord<T>(T record) where T : DynamicsEntity
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<T>();
        var data = modelDefinition.BuildDynamicsModel(record);
        
        await environmentUrl.AppendPathSegment(modelDefinition.Endpoint).PostJsonAsync(data);
    }
}