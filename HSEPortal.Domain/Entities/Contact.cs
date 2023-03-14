namespace HSEPortal.Domain.Entities;

public record Contact(string FirstName, string LastName, string PhoneNumber, string Email, string Id = null) : Entity(Id);

public record DynamicsContact(string firstname, string lastname, string telephone1, string emailaddress1, string contactid = null) : DynamicsEntity<Contact>;