using HSEPortal.Domain.Entities;

namespace HSEPortal.Domain.DynamicsDefinitions;

public class BuildingApplicationModelDefinition : DynamicsModelDefinition<BuildingApplication, DynamicsBuildingApplication>
{
    public override string Endpoint => "bsr_buildingapplications";

    public override DynamicsBuildingApplication BuildDynamicsEntity(BuildingApplication entity)
    {
        return new DynamicsBuildingApplication(entity.ApplicationId, entity.Id, contactReferenceId: $"/contacts({entity.ContactId})", buildingReferenceId: $"/bsr_buildings({entity.BuildingId})");
    }

    public override BuildingApplication BuildEntity(DynamicsBuildingApplication dynamicsEntity)
    {
        return new BuildingApplication(dynamicsEntity.bsr_applicationreturncode, dynamicsEntity.bsr_registreeId, dynamicsEntity._bsr_building_value, dynamicsEntity.bsr_buildingapplicationid);
    }
}