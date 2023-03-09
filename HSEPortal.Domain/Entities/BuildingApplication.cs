using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record BuildingApplication(string Name, string ApplicationId, string ContactId, string Id = null) : Entity(Id);

public record DynamicsBuildingApplication(string bsr_name, string bsr_applicationid, string bsr_buildingapplicationid = null, string bsr_registreeId = null,
    [property: JsonPropertyName("bsr_RegistreeId@odata.bind")]
    string contactReferenceId = null) : DynamicsEntity<BuildingApplication>;