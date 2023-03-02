using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record BuildingApplication(string Name, string ApplicationId, string Id = null) : Entity(Id);

public record DynamicsBuildingApplication(string bsr_name, string bsr_applicationid, string bsr_buildingapplicationid = null,
    [property: JsonPropertyName("bsr_buildingapplicationid@odata.bind")]
    string odataReferenceId = null) : DynamicsEntity<BuildingApplication>;