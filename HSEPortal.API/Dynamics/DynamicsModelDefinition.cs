using HSEPortal.API.Models;

namespace HSEPortal.API.Dynamics;

public abstract class DynamicsModelDefinition<TEntity, TDynamicsEntity> : IDynamicsModelDefinition where TEntity : Entity
    where TDynamicsEntity : DynamicsEntity<TEntity>
{
    public abstract string Endpoint { get; }

    public abstract DynamicsEntity<TEntity> BuildDynamicsEntity(TEntity entity);

    public abstract TEntity BuildEntity(TDynamicsEntity dynamicsEntity);
}

public interface IDynamicsModelDefinition
{
}