using HSEPortal.API.Models;

namespace HSEPortal.API.UnitTests.ModelDefinitions;

public class WhenGettingBuildingDetailsModelDefinition : WhenGettingDynamicsModelDefinition<BuildingDetails>
{
    protected override string Endpoint => "bsr_blocks";

    protected override BuildingDetails DynamicsEntity { get; } = new()
    {
        Id = "1",
        FloorsAbove = 300,
        Height = 800.5,
        PeopleLivingInBlock = PeopleLivingInBuilding.Yes,
        ResidentialUnits = 500
    };

    protected override object DynamicsModel { get; } = new
    {
        bsr_blockid = "1",
        bsr_numberofresidentialunits = 500,
        bsr_arepeoplelivingintheblock = PeopleLivingInBuilding.Yes,
        bsr_blockheightinmetres = 800.5,
        bsr_nooffloorsabovegroundlevel = 300,
    };
}