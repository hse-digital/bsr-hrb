using HSEPortal.API.Models;

namespace HSEPortal.API.Dynamics;

public class DynamicsModelDefinitionFactory
{
    private readonly Dictionary<Type, IDynamicsModelDefinition> definitions = new()
    {
        [typeof(ContactDetails)] = new ContactDetailsModelDefinition(),
        [typeof(BuildingDetails)] = new BuildingDetailsModelDefinition(),
    };

    public DynamicsModelDefinition<T> GetDefinitionFor<T>() where T : DynamicsEntity
    {
        if (definitions.TryGetValue(typeof(T), out var definition))
        {
            return (definition as DynamicsModelDefinition<T>)!;
        }

        throw new ArgumentException();
    }
}