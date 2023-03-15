using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record Structure(string Name, string FloorsAboveGround, string HeightInMeters, string NumberOfResidentialUnits,
    string PeopleLivingInStructure, string ConstructionYearOption, string ExactYear, 
    string YearRange, string Id = null) : Entity(Id);

public record DynamicsStructure(string bsr_name, int bsr_nooffloorsabovegroundlevel, double bsr_blockheightinmetres, 
    int bsr_numberofresidentialunits, PeopleLivingInStructure bsr_arepeoplelivingintheblock, ConstructionYearOption bsr_doyouknowtheblocksexactconstructionyear,
    [property:JsonPropertyName("bsr_exactconstructionyearid@odata.bind")]
    string exactConstructionYearReferenceId = null,
    [property:JsonPropertyName("bsr_SectionCompletionYearRange@odata.bind")]
    string bsr_SectionCompletionYearRange = null) : DynamicsEntity<Structure>;

public enum PeopleLivingInStructure
{
    Yes = 760_810_000,
    NoBlockReady = 760_810_001,
    NoWontMove = 760_810_002
}

public enum ConstructionYearOption
{
    Exact = 760_810_000,
    YearRange = 760_810_001,
    NotBuilt = 760_810_002
}