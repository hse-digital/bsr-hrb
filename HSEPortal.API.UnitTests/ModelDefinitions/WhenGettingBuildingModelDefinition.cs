using HSEPortal.API.Models;

namespace HSEPortal.API.UnitTests.ModelDefinitions;

public class WhenGettingBuildingModelDefinition : WhenGettingDynamicsModelDefinition<Building, DynamicsBuilding>
{
    protected override string Endpoint => "bsr_buildings";
}