using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record Structure(string Name, string FloorsAboveGround, string HeightInMeters, string NumberOfResidentialUnits,
    string PeopleLivingInStructure, string ConstructionYearOption, string ExactYear = null,
    string YearRange = null, string Id = null) : Entity(Id);

public record DynamicsStructure : DynamicsEntity<Structure>
{
    public string bsr_blockid { get; init; }
    public string bsr_kbistartdate { get; set; }
    public string bsr_name { get; set; }
    public int? bsr_nooffloorsabovegroundlevel { get; init; }
    public double? bsr_sectionheightinmetres { get; init; }
    public int? bsr_numberofresidentialunits { get; init; }
    public PeopleLivingInStructure? bsr_arepeoplelivingintheblock { get; init; }
    public ConstructionYearOption? bsr_doyouknowtheblocksexactconstructionyear { get; init; }
    public string bsr_addressline1 { get; init; }
    public string bsr_addressline2 { get; init; }
    public string bsr_city { get; init; }
    public string bsr_postcode { get; init; }
    public string bsr_uprn { get; init; }
    public string bsr_usrn { get; init; }
    public AddressType? bsr_addresstype { get; init; }
    public YesNoOption? bsr_manualaddress { get; init; }

    public string _bsr_buildingid_value { get; set; }

    [JsonPropertyName("bsr_Country@odata.bind")]
    public string countryReferenceId { get; init; }

    [JsonPropertyName("bsr_exactconstructionyearid@odata.bind")]
    public string exactConstructionYearReferenceId { get; init; }

    [JsonPropertyName("bsr_SectionCompletionYearRange@odata.bind")]
    public string sectionCompletionYearRangeReferenceId { get; init; }

    [JsonPropertyName("bsr_BuildingApplicationID@odata.bind")]
    public string buildingApplicationReferenceId { get; init; }

    [JsonPropertyName("bsr_BuildingId@odata.bind")]
    public string buildingReferenceId { get; init; }

    [JsonPropertyName("bsr_CompletionCertificate@odata.bind")]
    public string certificateReferenceId { get; init; }

    [JsonPropertyName("bsr_evacuationpolicy_blockId@odata.bind")]
    public string bsr_evacuationpolicy_blockid { get; init; }

    public int? bsr_doorsthatcertifiedfireresistanceisnotknow { get; set; }
    public int? bsr_doorwith120minutecertifiedfireresistance { get; set; }
    public int? bsr_doorswith30minutescertifiedfireresistance { get; set; }
    public int? bsr_doorswith60minutescertifiedfireresistance { get; set; }
    public int? bsr_doorswithnocertifiedfireresistance { get; set; }
    public int? bsr_doorthatcertifiedfireresistanceisnotknown { get; set; }
    public int? bsr_doorswith120minutecertifiedfireresistance { get; set; }
    public int? bsr_doorswith30minutecertifiedfireresistance { get; set; }
    public int? bsr_doorswith60minutecertifiedfireresistance { get; set; }
    public int? bsr_typeofroof { get; set; }
    public int? bsr_roofstructurelayerofinsulation { get; set; }

    [property: JsonPropertyName("bsr_primarymaterialofroof@odata.bind")]
    public string primaryRoofMaterialId { get; set; }

    public int? bsr_totalnumberofstaircases { get; set; }
    public int? bsr_numberofinternalstaircasesfromgroundlevel { get; set; }

    [property: JsonPropertyName("bsr_primaryuse@odata.bind")]
    public string primaryUseId { get; set; }

    [property: JsonPropertyName("bsr_primaryuseofbuildingbelowgroundlevel@odata.bind")]
    public string primaryUseBelowGroundId { get; set; }

    [property: JsonPropertyName("bsr_previoususeofbuilding@odata.bind")]
    public string previousUseId { get; set; }

    public int? bsr_numberoffloorsbelowgroundlevel { get; set; }
    
    public bool? bsr_differentprimaryuseinthepast { get; set; }
    public string bsr_changeofuseyearnew { get; set; }
    public string bsr_yearofmostrecentchangenew { get; set; }
    public string bsr_kbicompletiondate { get; set; }
    public bool? bsr_kbicomplete { get; set; }
    
    [JsonPropertyName("bsr_mostrecentworkcompleted@odata.bind")]
    public string recentWorkId { get; set; }
}

public static class DynamicsSectionArea
{
    public static readonly IDictionary<string, string> Ids = new Dictionary<string, string>
    {
        ["none"] = "5d36620b-04b1-ed11-83ff-0022481b5e4f",
        ["external_walls"] = "5d36620b-04b1-ed11-83ff-0022481b5e4f",
        ["routes"] = "1441d018-04b1-ed11-83ff-0022481b5e4f",
        ["maintenance"] = "2e3f1d2b-04b1-ed11-83ff-0022481b5e4f",
        ["facilities"] = "67916f37-04b1-ed11-83ff-0022481b5e4f"
    };
}

public static class DynamicsYearRangeIds
{
    public static readonly IDictionary<string, string> Ids = new Dictionary<string, string>
    {
        ["Before-1900"] = "e91e27f1-d7b2-ed11-83ff-0022481b5e4f",
        ["1901-to-1955"] = "dcbe36fd-d7b2-ed11-83ff-0022481b5e4f",
        ["1956-to-1969"] = "d8ac3915-d8b2-ed11-83ff-0022481b5e4f",
        ["1970-to-1984"] = "a3503d21-d8b2-ed11-83ff-0022481b5e4f",
        ["1985-to-2000"] = "5b90212e-d8b2-ed11-83ff-0022481b5e4f",
        ["2001-to-2006"] = "a189123a-d8b2-ed11-83ff-0022481b5e4f",
        ["2007-to-2018"] = "fa1a9540-d8b2-ed11-83ff-0022481b5e4f",
        ["2019-to-2022"] = "b1ffdd4c-d8b2-ed11-83ff-0022481b5e4f",
        ["2023-onwards"] = "2b75c692-d8b2-ed11-83ff-0022481b5e4f",
        ["not-completed"] = "65fcfda4-d8b2-ed11-83ff-0022481b5e4f"
    };
}

public static class DynamicsSectionEvacuation
{
    public static readonly IDictionary<string, string> Ids = new Dictionary<string, string>
    {
        ["phased"] = "971b1641-27eb-ed11-8847-6045bd0d6904",
        ["progressive_horizontal"] = "966abb53-27eb-ed11-8847-6045bd0d6904",
        ["simultaneous"] = "b2fc2760-27eb-ed11-8847-6045bd0d6904",
        ["stay_put"] = "d5be516c-27eb-ed11-8847-6045bd0d6904",
        ["temporary_simultaneous"] = "371d5378-27eb-ed11-8847-6045bd0d6904",
    };
}

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

public enum AddressType
{
    Primary = 760_810_000,
    BillTo = 760_810_001,
    ShipTo = 760_810_002,
    Other = 760_810_003
}

public enum YesNoOption
{
    Yes = 760_810_000,
    No = 760_810_001
}