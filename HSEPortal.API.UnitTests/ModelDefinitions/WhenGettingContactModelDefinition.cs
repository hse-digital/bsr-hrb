using HSEPortal.API.Models;

namespace HSEPortal.API.UnitTests.ModelDefinitions;

public class WhenGettingContactModelDefinition : WhenGettingDynamicsModelDefinition<Contact, DynamicsContact>
{
    protected override string Endpoint => "contacts";
}