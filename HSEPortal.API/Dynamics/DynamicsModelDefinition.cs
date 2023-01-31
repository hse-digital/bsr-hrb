using HSEPortal.API.Models;

namespace HSEPortal.API.Dynamics;

public abstract class DynamicsModelDefinition<T> : IDynamicsModelDefinition where T : DynamicsEntity
{
    public abstract string Endpoint { get; }
    public abstract object BuildDynamicsModel(T data);
    public abstract T BuildModelFromDynamics(dynamic model);
}

public interface IDynamicsModelDefinition
{
}