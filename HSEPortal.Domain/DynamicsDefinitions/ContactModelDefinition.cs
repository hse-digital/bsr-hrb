using HSEPortal.Domain.Entities;

namespace HSEPortal.Domain.DynamicsDefinitions;

public class ContactModelDefinition : DynamicsModelDefinition<Contact, DynamicsContact>
{
    public override string Endpoint => "contacts";

    public override DynamicsContact BuildDynamicsEntity(Contact entity)
    {
        return new DynamicsContact(entity.FirstName, entity.LastName, entity.PhoneNumber, entity.Email, contactid: entity.Id);
    }

    public override Contact BuildEntity(DynamicsContact dynamicsEntity)
    {
        throw new NotImplementedException();
    }
}