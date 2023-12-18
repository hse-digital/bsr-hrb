using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record BuildingApplication(string ContactId, string BuildingId, string Id = null) : Entity(Id);

public record DynamicsBuildingApplication(string bsr_buildingapplicationid = null,
    string _bsr_registreeid_value = null, string _bsr_building_value = null,
    [property: JsonPropertyName("bsr_RegistreeId@odata.bind")]
    string contactReferenceId = null,
    [property: JsonPropertyName("bsr_secondaryapplicantid@odata.bind")]
    string secondaryContactReferenceId = null,
    string _bsr_secondaryapplicantid_value = null,
    [property: JsonPropertyName("bsr_Building@odata.bind")]
    string buildingReferenceId = null,
    BuildingApplicationStage? bsr_applicationstage = null,
    bool? bsr_declarationconfirmed = null,
    bool? bsr_continuedanyway = null,
    string bsr_reasonforcontinuing = null,
    [property: JsonPropertyName("bsr_papid@odata.bind")]
    string bsrPapReferenceId = null,
    DynamicsBuilding bsr_Building = null,
    DynamicsContact bsr_RegistreeId = null,
    BuildingApplicationWhoAreYou? bsr_whoareyou = null,
    [property: JsonPropertyName("bsr_paporgleadcontactid@odata.bind")]
    string papLeadContactReferenceId = null,
    string bsr_applicationid = null,
    BuildingApplicationStatuscode? statuscode = null,
    string bsr_submittedon = null,
    string bsr_numberofmanuallyenteredaddresses = null,
    bool? bsr_sharedetailsdeclared = null,
    bool? bsr_duplicatedetected = null,
    [property: JsonPropertyName("bsr_cancellationreason@odata.bind")] 
    string bsr_cancellationreason = null,
    int? bsr_previouspaptype = null,
    [property: JsonPropertyName("bsr_previouspap_contact@odata.bind")]
    string? bsr_previouspap_contact = null,
    [property: JsonPropertyName("bsr_previouspap_account@odata.bind")]
    string? bsr_previouspap_account = null,
    [property: JsonPropertyName("bsr_previouspaporgleadcontactid@odata.bind")]
    string? bsr_previouspaporgleadcontactid = null,
    string? _bsr_papid_value = null,
    int? bsr_paptype = null) : DynamicsEntity<BuildingApplication>;

public enum BuildingApplicationStage
{
    BuildingSummary = 760_810_000,
    AccountablePersons = 760_810_001,
    PayAndApply = 760_810_002,
    ApplicationSubmitted = 760_810_003,
    InvoiceRaised = 760_810_004
}

public enum ContinuedAnywaysOptions
{
    No = 0,
    Yes = 1
}

public enum BuildingApplicationWhoAreYou
{
    NamedContact = 760_810_000,
    RegisteringFor = 760_810_001,
    Employee = 760_810_002
}

public enum BuildingApplicationStatuscode
{
    New = 760_810_001,
    InProgress = 760_810_002,
    SubmittedAwaitingAllocation = 760_810_003,
    AllocatedReview = 760_810_004,
    UnderReview = 760_810_005,
    RegisteredPendingQA = 760_810_006,
    RejectedPendingQA = 760_810_007,
    AllocatedRework = 760_810_012,
    ReadyForQA = 760_810_008,
    Registered = 760_810_015,
    QAInProgress = 760_810_009,
    RegisteredPendingChange = 760_810_016,
    RegisteredKbiValidated = 760_810_017,
    Rejected = 760_810_011,
    Withdrawn = 760_810_013,
    OnHold = 760_810_014,
    Cancelled  = 760_810_018
}