﻿using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record Structure(string Name, string FloorsAboveGround, string HeightInMeters, string NumberOfResidentialUnits,
    string PeopleLivingInStructure, string ConstructionYearOption, string ExactYear = null,
    string YearRange = null, string Id = null) : Entity(Id);

public record DynamicsStructure(string bsr_name, int bsr_nooffloorsabovegroundlevel, double bsr_blockheightinmetres,
    int bsr_numberofresidentialunits, PeopleLivingInStructure bsr_arepeoplelivingintheblock, ConstructionYearOption bsr_doyouknowtheblocksexactconstructionyear,
    string bsr_blockid = null,
    string bsr_addressline1 = null, string bsr_addressline2 = null, string bsr_city = null, string bsr_postcode = null, string bsr_uprn = null, string bsr_usrn = null, AddressType? bsr_addresstype = null, YesNoOption? bsr_manualaddress = null, 
    [property: JsonPropertyName("bsr_exactconstructionyearid@odata.bind")]
    string exactConstructionYearReferenceId = null,
    [property: JsonPropertyName("bsr_SectionCompletionYearRange@odata.bind")]
    string sectionCompletionYearRangeReferenceId = null,
    [property: JsonPropertyName("bsr_BuildingApplicationID@odata.bind")]
    string buildingApplicationReferenceId = null,
    [property: JsonPropertyName("bsr_BuildingId@odata.bind")]
    string buildingReferenceId = null) : DynamicsEntity<Structure>;

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
