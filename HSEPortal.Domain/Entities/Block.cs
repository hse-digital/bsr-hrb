using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record Block(string Name, int FloorsAbove, double Height, PeopleLivingInBuilding? PeopleLivingInBlock, int ResidentialUnits, string Id = null, string BuildingId = null) : Entity(Id);

public record DynamicsBlock(string bsr_name, int bsr_nooffloorsabovegroundlevel, double bsr_blockheightinmetres,
    PeopleLivingInBuilding? bsr_arepeoplelivingintheblock, int bsr_numberofresidentialunits, string bsr_blockid = null, string bsr_Building_BlockId = null,
    [property: JsonPropertyName("bsr_Building_BlockId@odata.bind")]
    string odataReferenceId = null) : DynamicsEntity<Block>;

public enum PeopleLivingInBuilding
{
    Yes = 760_810_000,
    NoReadyToMove = 760_810_001,
    NoPeopleWontMove = 760_810_002
}