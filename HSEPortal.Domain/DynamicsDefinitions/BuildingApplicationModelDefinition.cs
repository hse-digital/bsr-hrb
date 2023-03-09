using HSEPortal.Domain.Entities;

namespace HSEPortal.Domain.DynamicsDefinitions;

public class BuildingApplicationModelDefinition : DynamicsModelDefinition<BuildingApplication, DynamicsBuildingApplication>
{
    public override string Endpoint => "bsr_buildingapplications";

    public override DynamicsBuildingApplication BuildDynamicsEntity(BuildingApplication entity)
    {
        return new DynamicsBuildingApplication(entity.Name, entity.ApplicationId, entity.Id, contactReferenceId: $"/contacts({entity.ContactId})");
    }

    public override BuildingApplication BuildEntity(DynamicsBuildingApplication dynamicsEntity)
    {
        return new BuildingApplication(dynamicsEntity.bsr_name, dynamicsEntity.bsr_applicationid, dynamicsEntity.bsr_registreeId, dynamicsEntity.bsr_buildingapplicationid);
    }
}