using HSEPortal.API.Models;

namespace HSEPortal.API.Dynamics;

public class ContactModelDefinition : DynamicsModelDefinition<Contact, DynamicsContact>
{
    public override string Endpoint => "contacts";

    public override DynamicsContact BuildDynamicsEntity(Contact entity)
    {
        return new DynamicsContact
        {
            contactid = entity.Id,
            firstname = entity.FirstName,
            lastname = entity.LastName,
            telephone1 = entity.PhoneNumber,
            emailaddress1 = entity.Email
        };
    }

    public override Contact BuildEntity(DynamicsContact dynamicsEntity)
    {
        throw new NotImplementedException();
    }
}