using HSEPortal.Domain.Entities;

namespace HSEPortal.API.UnitTests.ModelDefinitions;

public class WhenGettingBuildingApplicationModelDefinition : WhenGettingDynamicsModelDefinition<BuildingApplication, DynamicsBuildingApplication>
{
    protected override string Endpoint => "bsr_buildingapplications";
}