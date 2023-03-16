using HSEPortal.Domain.Entities;

namespace HSEPortal.API.Model.DynamicsSynchronisation;
public record Structures(SectionModel[] BuildingStructures, DynamicsBuildingApplication DynamicsBuildingApplication);