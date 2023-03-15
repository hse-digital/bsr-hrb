using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record BuildingApplication(string ApplicationId, string ContactId, string BuildingId, string Id = null) : Entity(Id);

public record DynamicsBuildingApplication(string bsr_applicationreturncode, string bsr_buildingapplicationid = null,
    string bsr_registreeId = null, string bsr_building = null,
    [property: JsonPropertyName("bsr_RegistreeId@odata.bind")]
    string contactReferenceId = null,
    [property: JsonPropertyName("bsr_Building@odata.bind")]
    string buildingReferenceId = null) : DynamicsEntity<BuildingApplication>;