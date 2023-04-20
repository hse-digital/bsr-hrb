using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using HSEPortal.API.Model.Payment.Response;

namespace HSEPortal.API.Model;

public record BuildingApplicationModel(
    [property: JsonPropertyName("id")] string Id,
    string BuildingName = null,
    string ContactFirstName = null,
    string ContactLastName = null,
    string ContactPhoneNumber = null,
    string ContactEmailAddress = null,
    string NumberOfSections = null,
    SectionModel[] Sections = null,
    AccountablePerson[] AccountablePersons = null,
    string OutOfScopeContinueReason = null,
    string PrincipalAccountableType = null,
    BuildingApplicationStatus ApplicationStatus = BuildingApplicationStatus.None) : IValidatableModel
{
    public ValidationSummary Validate()
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(BuildingName))
        {
            errors.Add("Building name is required");
        }

        if (string.IsNullOrWhiteSpace(ContactFirstName))
        {
            errors.Add("Contact first name is required");
        }

        if (string.IsNullOrWhiteSpace(ContactLastName))
        {
            errors.Add("Contact last name is required");
        }

        if (string.IsNullOrWhiteSpace(ContactPhoneNumber))
        {
            errors.Add("Contact phone number is required");
        }
        else if (!PhoneNumberIsValid())
        {
            errors.Add(
                "You must enter a UK telephone number. For example, 01632 960 001, 07700 900 982 or +44 808 157 0192");
        }

        if (string.IsNullOrWhiteSpace(ContactEmailAddress))
        {
            errors.Add("Contact email address is required");
        }

        return new ValidationSummary(!errors.Any(), errors.ToArray());
    }

    private bool PhoneNumberIsValid()
    {
        var noSpacesPhoneNumber = ContactPhoneNumber.Replace(" ", string.Empty);
        return Regex.IsMatch(noSpacesPhoneNumber, @"^\+44\d{10}$") || Regex.IsMatch(noSpacesPhoneNumber, @"^0\d{10}$");
    }
}

public record SectionModel(string Name, 
        string FloorsAbove, string Height, string PeopleLivingInBuilding, 
        string ResidentialUnits, string YearOfCompletionOption, string YearOfCompletion, string YearOfCompletionRange,
        string CompletionCertificateIssuer, string CompletionCertificateReference, BuildingAddress[] Addresses = null);

public record AccountablePerson(string Type = null, string IsPrincipal = null, BuildingAddress Address = null, BuildingAddress PapAddress = null,
    string OrganisationName = null, string OrganisationType = null, string OrganisationTypeDescription = null,
    string NamedContactFirstName = null, string NamedContactLastName = null, string NamedContactEmail = null, string NamedContactPhoneNumber = null,
    string FirstName = null, string LastName = null, string Email = null, string PhoneNumber = null, string Role = null, string LeadJobRole = null, 
    string ActingForSameAddress = null, BuildingAddress ActingForAddress = null, string LeadFirstName = null, string LeadLastName = null, 
    string LeadEmail = null, string LeadPhoneNumber = null, SectionAccountability[] SectionsAccountability = null);

public record SectionAccountability(string SectionName, string[] Accountability);

[Flags]
public enum BuildingApplicationStatus
{
    None = 0,
    BlocksInBuildingInProgress = 1,
    BlocksInBuildingComplete = 2,
    AccountablePersonsInProgress = 4,
    AccountablePersonsComplete = 8,
    PaymentInProgress = 16,
    PaymentComplete = 32
}
