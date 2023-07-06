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
    KbiModel Kbi = null,
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
    string CompletionCertificateIssuer, string CompletionCertificateReference, Scope Scope, BuildingAddress[] Addresses = null);

public record Scope(bool IsOutOfScope, OutOfScopeReason OutOfScopeReason);

public enum OutOfScopeReason { Height, NumberResidentialUnits, PeopleLivingInBuilding }

public record AccountablePerson(string Type, string IsPrincipal, BuildingAddress Address, BuildingAddress PapAddress,
    string OrganisationName, string OrganisationType, string OrganisationTypeDescription,
    string NamedContactFirstName, string NamedContactLastName, string NamedContactEmail, string NamedContactPhoneNumber,
    string FirstName, string LastName, string Email, string PhoneNumber, string Role, string LeadJobRole,
    string ActingForSameAddress, BuildingAddress ActingForAddress, string LeadFirstName, string LeadLastName,
    string LeadEmail, string LeadPhoneNumber, SectionAccountability[] SectionsAccountability, string AddAnother);

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
    PaymentComplete = 32,
    KbiCheckBeforeInProgress = 64,
    KbiCheckBeforeComplete = 128,
    KbiStructureInformationInProgress = 256,
    KbiStructureInformationComplete = 512,
    KbiConnectionsInProgress = 1024,
    KbiConnectionsComplete = 2048,
    KbiSubmitInProgress = 4096,
    KbiSubmitComplete = 8192
}

public record KbiModel(KbiSectionModel[] KbiSections,
        SectionStatus[] SectionStatus,
        Connections Connections,
        Submit Submit,
        string ApplicationId);

public record SectionStatus(bool InProgress, bool Complete);

public record KbiSectionModel(Fire Fire, 
        Energy Energy,
        BuildingStructure BuildingStructure,
        Roof Roof,
        Staircases Staircases,
        Walls Walls,
        BuildingUse BuildingUse,
        
        string StructureName,
        string Postcode,
        string StrategyEvacuateBuilding,
        string ApplicationId);

public record ExternalWallInsulation(string[] CheckBoxSelection, string OtherValue);

public record Fire(string StrategyEvacuateBuilding,
    string[] ProvisionsEquipment,
    string[] FireSmokeProvisions,
    Dictionary<string, string[]> FireSmokeProvisionLocations,
    string[] Lifts,
    ResidentialUnitFrontDoors ResidentialUnitFrontDoors,
    FireDoorsCommon FireDoorsCommon);

public record FireDoorsCommon(string FireDoorThirtyMinute, string FireDoorSixtyMinute, string FireDoorHundredTwentyMinute, string FireDoorUnknown);

public record ResidentialUnitFrontDoors(string NoFireResistance, string ThirtyMinsFireResistance, string SixtyMinsFireResistance,
    string HundredTwentyMinsFireResistance, string NotKnownFireResistance);

public record Energy(string[] EnergySupply,
    string[] EnergyTypeStorage,
    string[] OnsiteEnergyGeneration);

public record BuildingStructure(string[] BuildingStructureType);

public record Roof(string RoofType,
    string RoofInsulation,
    string RoofMaterial);

public record Staircases(string InternalStaircasesAllFloors,
    string TotalNumberStaircases);

public record Walls(string[] ExternalWallMaterials,
    string WallACM,
    string WallHPL,
    Dictionary<string, string> ExternalWallMaterialsPercentage,
    ExternalWallInsulation ExternalWallInsulation,
    Dictionary<string, string> ExternalWallInsulationPercentages,
    string[] ExternalFeatures,
    Dictionary<string, string[]> FeatureMaterialsOutside);

public record BuildingUse(string PrimaryUseOfBuilding,
    string[] SecondaryUseBuilding,
    string FloorsBelowGroundLevel,
    string PrimaryUseBuildingBelowGroundLevel,
    string ChangePrimaryUse,
    string PreviousUseBuilding,
    string YearChangeInUse,
    string[] AddedFloorsType,
    string[] UndergoneBuildingMaterialChanges,
    string MostRecentMaterialChange,
    string YearMostRecentMaterialChange);

public record Connections (string[] StructureConnections,
        string OtherHighRiseBuildingConnections,
        string[] HowOtherHighRiseBuildingAreConnected,
        string OtherBuildingConnections,
        string[] HowOtherBuildingAreConnected);

public record Submit ();
