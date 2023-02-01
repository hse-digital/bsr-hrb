using System.Text.Json.Serialization;

namespace HSEPortal.API.Models;

public class Building : Entity
{
    public string Name { get; set; }

    public BuildingApplication Application { get; set; }
}

public class DynamicsBuilding : DynamicsEntity<Building>
{
    public string bsr_buildingid { get; set; }
    public string bsr_name { get; set; }
    public DynamicsBuildingApplication bsr_buildingapplication_buildingId { get; set; }
}