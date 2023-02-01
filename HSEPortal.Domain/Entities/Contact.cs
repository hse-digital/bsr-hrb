using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record Contact(string FirstName, string LastName, string PhoneNumber, string Email, string Id = null, string BuildingId = null) : Entity(Id);

public record DynamicsContact(string firstname, string lastname, string telephone1, string emailaddress1, string contactid = null, string bsr_building_contactId = null,
    [property: JsonPropertyName("bsr_building_contactId@odata.bind")]
    string odataReferenceId = null) : DynamicsEntity<Contact>;