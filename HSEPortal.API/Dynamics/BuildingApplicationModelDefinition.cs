using HSEPortal.API.Models;

namespace HSEPortal.API.Dynamics;

public class BuildingApplicationModelDefinition : DynamicsModelDefinition<BuildingApplication, DynamicsBuildingApplication>
{
    public override string Endpoint => "bsr_buildingapplications";
    
    public override DynamicsBuildingApplication BuildDynamicsEntity(BuildingApplication entity)
    {
        throw new NotImplementedException();
    }

    public override BuildingApplication BuildEntity(DynamicsBuildingApplication dynamicsEntity)
    {
        throw new NotImplementedException();
    }
}