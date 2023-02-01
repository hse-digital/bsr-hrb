using System.Text.Json.Serialization;

namespace HSEPortal.API.Models;

public class Contact : Entity
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
}

public class DynamicsContact : DynamicsEntity<Contact>
{
    public string contactid { get; set; }
    public string firstname { get; set; }
    public string lastname { get; set; }
    public string telephone1 { get; set; }
    public string emailaddress1 { get; set; }
}