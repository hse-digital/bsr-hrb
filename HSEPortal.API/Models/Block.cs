namespace HSEPortal.API.Models;

public class Block : Entity
{
    public string Name { get; set; }
    public int FloorsAbove { get; set; }
    public double Height { get; set; }
    public PeopleLivingInBuilding? PeopleLivingInBlock { get; set; }
    public int ResidentialUnits { get; set; }
    public Building Building { get; set; }
}

public class DynamicsBlock : DynamicsEntity<Block>
{
    public string bsr_blockid { get; set; }
    public string bsr_name { get; set; }
    public int bsr_nooffloorsabovegroundlevel { get; set; }
    public double bsr_blockheightinmetres { get; set; }
    public PeopleLivingInBuilding? bsr_arepeoplelivingintheblock { get; set; }
    public int bsr_numberofresidentialunits { get; set; }
    public DynamicsBuilding bsr_Building_BlockId { get; set; }
}

public enum PeopleLivingInBuilding
{
    Yes = 760810000,
    NoReadyToMove = 760810001,
    NoPeopleWontMove = 760810002
}