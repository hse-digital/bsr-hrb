using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record BuildingApplication(string ApplicationId, string ContactId, string BuildingId, string Id = null) : Entity(Id);

public record DynamicsBuildingApplication(string bsr_applicationreturncode = null, string bsr_buildingapplicationid = null,
    string _bsr_registreeid_value = null, string _bsr_building_value = null,
    [property: JsonPropertyName("bsr_RegistreeId@odata.bind")]
    string contactReferenceId = null,
    [property: JsonPropertyName("bsr_Building@odata.bind")]
    string buildingReferenceId = null,
    BuildingApplicationStage? bsr_applicationstage = null,
    bool? bsr_declarationconfirmed = null,
    bool? bsr_continuedanyway = null,
    string bsr_reasonforcontinuing = null,
    [property: JsonPropertyName("bsr_papid@odata.bind")]
    string bsrPapReferenceId = null,
    DynamicsBuilding bsr_Building = null,
    DynamicsContact bsr_RegistreeId = null) : DynamicsEntity<BuildingApplication>;

public enum BuildingApplicationStage
{
    BuildingSummary = 760_810_000,
    AccountablePersons = 760_810_001,
    PayAndApply = 760_810_002,
    ApplicationSubmitted = 760_810_003
}

public enum ContinuedAnywaysOptions
{
    No = 0,
    Yes = 1
}