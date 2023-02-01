using Flurl;
using Flurl.Http;
using HSEPortal.API.Models;
using Microsoft.Extensions.Configuration;

namespace HSEPortal.API.Dynamics;

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

    public async Task SaveRecord<TEntity, TDynamicsEntity>(TEntity record) where TEntity : Entity
        where TDynamicsEntity : DynamicsEntity<TEntity>
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<TEntity, TDynamicsEntity>();
        var dynamicsEntity = modelDefinition.BuildDynamicsEntity(record);
        await environmentUrl.AppendPathSegment(modelDefinition.Endpoint).PostJsonAsync(dynamicsEntity);
    }
}