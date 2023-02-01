using HSEPortal.API.Models;

namespace HSEPortal.API.Dynamics;

public class BuildingModelDefinition : DynamicsModelDefinition<Building, DynamicsBuilding>
{
    public override string Endpoint => "bsr_buildings";

    public override DynamicsBuilding BuildDynamicsEntity(Building entity)
    {
        return new DynamicsBuilding
        {
            bsr_buildingid = entity.Id,
            bsr_name = entity.Name
        };
    }

    public override Building BuildEntity(DynamicsBuilding dynamicsEntity)
    {
        throw new NotImplementedException();
    }
}