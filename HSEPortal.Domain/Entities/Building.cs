using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record Building(string Name, string Id = null, string BuildingApplicationId = null) : Entity(Id);

public record DynamicsBuilding(string bsr_name, string bsr_buildingid = null, string bsr_buildingapplication_buildingId = null,
    [property: JsonPropertyName("bsr_buildingapplication_buildingId@odata.bind")]
    string odataReferenceId = null) : DynamicsEntity<Building>;