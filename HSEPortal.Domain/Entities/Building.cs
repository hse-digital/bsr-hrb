namespace HSEPortal.Domain.Entities;

public record Building(string Name, string Id = null) : Entity(Id);

public record DynamicsBuilding(string bsr_name, string bsr_buildingid = null) : DynamicsEntity<Building>;