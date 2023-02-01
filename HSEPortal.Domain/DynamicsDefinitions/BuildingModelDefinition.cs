using HSEPortal.Domain.Entities;

namespace HSEPortal.Domain.DynamicsDefinitions;

public class BuildingModelDefinition : DynamicsModelDefinition<Building, DynamicsBuilding>
{
    public override string Endpoint => "bsr_buildings";

    public override DynamicsBuilding BuildDynamicsEntity(Building entity)
    {
        return new DynamicsBuilding(entity.Name, entity.Id, odataReferenceId: $"/bsr_buildingapplications({entity.BuildingApplicationId})");
    }

    public override Building BuildEntity(DynamicsBuilding dynamicsEntity)
    {
        return new Building(dynamicsEntity.bsr_name, Id: dynamicsEntity.bsr_buildingid, dynamicsEntity.bsr_buildingapplication_buildingId);
    }
}