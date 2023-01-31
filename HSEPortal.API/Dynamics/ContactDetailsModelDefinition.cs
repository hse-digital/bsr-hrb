using HSEPortal.API.Models;

namespace HSEPortal.API.Dynamics;

public class ContactDetailsModelDefinition : DynamicsModelDefinition<ContactDetails>
{
    public override string Endpoint => "contacts";

    public override object BuildDynamicsModel(ContactDetails contactDetails)
    {
        return new
        {
            contactid = contactDetails.Id,
            firstname = contactDetails.FirstName,
            lastname = contactDetails.LastName,
            emailaddress1 = contactDetails.Email,
            telephone1 = contactDetails.PhoneNumber
        };
    }

    public override ContactDetails BuildModelFromDynamics(dynamic model)
    {
        throw new NotImplementedException();
    }
}