using System.Text.Json.Serialization;

namespace HSEPortal.API.Models;

public class BuildingApplication : Entity
{
    public string Name { get; set; }
}

public class DynamicsBuildingApplication : DynamicsEntity<BuildingApplication>
{
    public string bsr_buildingapplicationid { get; set; }
    public string bsr_name { get; set; }
}