using HSEPortal.API.Models;

namespace HSEPortal.API.UnitTests.ModelDefinitions;

public class WhenGettingContactDetailsModelDefinition : WhenGettingDynamicsModelDefinition<ContactDetails>
{
    protected override string Endpoint => "contacts";

    protected override ContactDetails DynamicsEntity { get; } = new()
    {
        Id = "1",
        FirstName = "abc",
        LastName = "def",
        Email = "email@email.com",
        PhoneNumber = "+441234567896"
    };

    protected override object DynamicsModel { get; } = new
    {
        contactid = "1",
        firstname = "abc",
        lastname = "def",
        emailaddress1 = "email@email.com",
        telephone1 = "+441234567896"
    };
}