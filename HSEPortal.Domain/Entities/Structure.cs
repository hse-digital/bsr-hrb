using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record Structure(string Name, string FloorsAboveGround, string HeightInMeters, string NumberOfResidentialUnits,
    string PeopleLivingInStructure, string ConstructionYearOption, string ExactYear = null,
    string YearRange = null, string Id = null) : Entity(Id);

public record DynamicsStructure(string bsr_name = null, int? bsr_nooffloorsabovegroundlevel = null, double? bsr_sectionheightinmetres = null,
    int? bsr_numberofresidentialunits = null, PeopleLivingInStructure? bsr_arepeoplelivingintheblock = null, ConstructionYearOption? bsr_doyouknowtheblocksexactconstructionyear = null,
    string bsr_blockid = null,
    string bsr_addressline1 = null, string bsr_addressline2 = null, string bsr_city = null, string bsr_postcode = null, string bsr_uprn = null, string bsr_usrn = null, AddressType? bsr_addresstype = null, YesNoOption? bsr_manualaddress = null,
    [property: JsonPropertyName("bsr_Country@odata.bind")]
    string countryReferenceId = null,
    [property: JsonPropertyName("bsr_exactconstructionyearid@odata.bind")]
    string exactConstructionYearReferenceId = null,
    [property: JsonPropertyName("bsr_SectionCompletionYearRange@odata.bind")]
    string sectionCompletionYearRangeReferenceId = null,
    [property: JsonPropertyName("bsr_BuildingApplicationID@odata.bind")]
    string buildingApplicationReferenceId = null,
    [property: JsonPropertyName("bsr_BuildingId@odata.bind")]
    string buildingReferenceId = null,
    [property: JsonPropertyName("bsr_CompletionCertificate@odata.bind")]
    string certificateReferenceId = null) : DynamicsEntity<Structure>;

public static class DynamicsSectionArea
{
    public static readonly IDictionary<string, string> Ids = new Dictionary<string, string>
    {
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