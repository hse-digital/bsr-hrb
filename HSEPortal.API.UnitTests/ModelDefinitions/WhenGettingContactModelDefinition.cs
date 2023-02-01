using HSEPortal.Domain.Entities;

namespace HSEPortal.API.UnitTests.ModelDefinitions;

public class WhenGettingContactModelDefinition : WhenGettingDynamicsModelDefinition<Contact, DynamicsContact>
{
    protected override string Endpoint => "contacts";
}