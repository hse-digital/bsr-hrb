using HSEPortal.API.Models;

namespace HSEPortal.API.Dynamics;

public class BuildingDetailsModelDefinition : DynamicsModelDefinition<BuildingDetails>
{
    public override string Endpoint => "bsr_blocks";

    public override object BuildDynamicsModel(BuildingDetails contactDetails)
    {
        return new
        {
            bsr_blockid = contactDetails.Id,
            bsr_numberofresidentialunits = contactDetails.ResidentialUnits,
            bsr_arepeoplelivingintheblock = contactDetails.PeopleLivingInBlock,
            bsr_blockheightinmetres = contactDetails.Height,
            bsr_nooffloorsabovegroundlevel = contactDetails.FloorsAbove
        };
    }

    public override BuildingDetails BuildModelFromDynamics(dynamic model)
    {
        throw new NotImplementedException();
    }
}