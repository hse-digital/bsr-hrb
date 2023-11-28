using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace HSEPortal.API.Model;

public record BuildingApplicationModel(
    [property: JsonPropertyName("id")] string Id,
    string BuildingName = null,
    string ContactFirstName = null,
    string ContactLastName = null,
    string ContactPhoneNumber = null,
    string ContactEmailAddress = null,
    string NewPrimaryUserEmail = null,
    string SecondaryFirstName = null,
    string SecondaryLastName = null,
    string SecondaryPhoneNumber = null,
    string SecondaryEmailAddress = null,
    bool? IsSecondary = null,
    string NumberOfSections = null,
    [property: Obsolete] SectionModel[] Sections = null,
    [property: Obsolete] AccountablePerson[] AccountablePersons = null,
    [property: Obsolete] KbiModel Kbi = null,
    string OutOfScopeContinueReason = null,
    string PrincipalAccountableType = null,
    string PaymentType = null,
    PaymentInvoiceDetails PaymentInvoiceDetails = null,
    BuildingApplicationStatus ApplicationStatus = BuildingApplicationStatus.None,
    bool? DuplicateDetected = null,
    bool? ShareDetailsDeclared = null,
    string[] DuplicateBuildingApplicationIds = null,
    RegistrationAmendmentsModel RegistrationAmendmentsModel = null,
    List<BuildingApplicationVersion> Versions = null) : IValidatableModel
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

    public BuildingApplicationVersion CurrentVersion
    {
        get
        {
            var version = Versions?.FirstOrDefault();
            while (!string.IsNullOrEmpty(version?.ReplacedBy))
            {
                version = Versions.FirstOrDefault(x => x.Name == version.ReplacedBy);
            }

            return version;
        }
    }
}

public record BuildingApplicationVersion(string Name, string ReplacedBy = null, string CreatedBy = null, bool? Submitted = null, SectionModel[] Sections = null,
    AccountablePerson[] AccountablePersons = null, Status BuildingStatus = Status.NoChanges, Status ApChangesStatus = Status.NoChanges, KbiModel Kbi = null);

public record SectionModel(string Name,
    string FloorsAbove, string Height, string PeopleLivingInBuilding,
    string ResidentialUnits, string YearOfCompletionOption, string YearOfCompletion, string YearOfCompletionRange, string WhoIssuedCertificate, string CompletionCertificateDate,
    string CompletionCertificateIssuer, string CompletionCertificateReference, FileUploadModel CompletionCertificateFile, Scope Scope, string Statecode, CancellationReason CancellationReason = CancellationReason.NoCancellationReason, BuildingAddress[] Addresses = null,
    Duplicate Duplicate = null)
{
    public Status Status { get; set; }
    public string WhyWantRemoveSection { get; set; }
    public string RemoveStructureAreYouSure { get; set; }
};

public record Scope(bool IsOutOfScope, OutOfScopeReason OutOfScopeReason);

public record Duplicate(string DuplicatedAddressIndex, string WhyContinue = null, bool? IsDuplicated = null,
    string IncludeStructure = null, string[] BlockIds = null, bool? DuplicateFound = null);

public enum OutOfScopeReason
{
    Height,
    NumberResidentialUnits,
    PeopleLivingInBuilding
}

public record AccountablePerson(string Type, string IsPrincipal, BuildingAddress Address, BuildingAddress PapAddress,
    string OrganisationName, string OrganisationType, string OrganisationTypeDescription,
    string NamedContactFirstName, string NamedContactLastName, string NamedContactEmail, string NamedContactPhoneNumber,
    string FirstName, string LastName, string Email, string PhoneNumber, string Role, string LeadJobRole,
    string ActingForSameAddress, BuildingAddress ActingForAddress, string LeadFirstName, string LeadLastName,
    string LeadEmail, string LeadPhoneNumber, SectionAccountability[] SectionsAccountability, string AddAnother);

public record SectionAccountability(string SectionName, string[] Accountability);

public record FileUploadModel(string Filename, bool Uploaded);

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

public record Connections(string[] StructureConnections,
    string OtherHighRiseBuildingConnections,
    string[] HowOtherHighRiseBuildingAreConnected,
    string OtherBuildingConnections,
    string[] HowOtherBuildingAreConnected);

public record Submit();

public record PaymentInvoiceDetails
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string AddressLine1 { get; set; }
    public string AddressLine2 { get; set; }
    public string Town { get; set; }
    public string Postcode { get; set; }
    public string OrderNumberOption { get; set; }
    public string OrderNumber { get; set; }
    public string Status { get; set; }
}

public record RegistrationAmendmentsModel
{
    public ChangeUser ChangeUser { get; set; }
    public long Date { get; set; }
    public Deregister Deregister { get; set; }
    public ChangeRequest[] ChangeRequest { get; set; }
}

public record Deregister
{
    public string AreYouSure { get; set; }
    public string Why { get; set; }
    public CancellationReason CancellationReason { get; set; }
}


public record ChangeUser
{
    public User PrimaryUser { get; set; }
    public User NewPrimaryUser { get; set; }
    public User SecondaryUser { get; set; }
    public User NewSecondaryUser { get; set; }
    public string WhoBecomePrimary { get; set; }
    public string WhoBecomeSecondary { get; set; }
}

public record User
{
    public Status Status { get; set; }
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
}

public enum Status
{
    NoChanges = 0,
    ChangesInProgress = 1,
    ChangesComplete = 2,
    ChangesSubmitted = 4,
    Removed = 8
}

public record ChangeRequest
{
    public string Name { get; set; }
    public string StructureName { get; set; }
    public string StructurePostcode { get; set; }
    public ChangeCategory Category { get; set; }
    public bool Declaration { get; set; }
    public bool ReviewRequired { get; set; }
    public Change[] Change { get; set; }
    public Status Status { get; set; }
}

public record Change
{
    public string Name { get; set; }
    public string Table { get; set; }
    public string FieldName { get; set; }
    public string OriginalAnswer { get; set; }
    public string NewAnswer { get; set; }
}

public enum ChangeCategory
{
    ApplicationBuildingAmendments,
    ChangeApplicantUser,
    DeRegistration,
    ChangePAPOrLeadContact
}

public enum CancellationReason {
  FloorsHeight,
  ResidentialUnits,
  EveryoneMovedOut,
  IncorrectlyRegistered,
  NoConnected,
  NoCancellationReason
}