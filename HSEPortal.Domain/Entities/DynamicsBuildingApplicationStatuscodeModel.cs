
namespace HSEPortal.Domain.Entities;

public record DynamicsBuildingApplicationStatuscodeModel(
    BuildingApplicationStatuscode statuscode = BuildingApplicationStatuscode.New,
    string bsr_buildingapplicationid = null
);