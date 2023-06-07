using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record Building(string Name, string Id = null) : Entity(Id);

public record DynamicsBuilding(string bsr_name = null, string bsr_buildingid = null,
    [property: JsonPropertyName("bsr_papid@odata.bind")]
    string bsrPapReferenceId = null) : DynamicsEntity<Building>
{
    public DateTime bsr_kbistartdate { get; set; }
}

public record DynamicsPapLookup(
    [property: JsonPropertyName("bsr_papid_account@odata.bind")]
    string papAccountReferenceId = null,
    [property: JsonPropertyName("bsr_papid_contact@odata.bind")]
    string papContactReferenceId = null,
    int? bsr_paptypecode = null,
    int? bsr_paptype = null,
    bool? bsr_areyouthepap = null,
    BuildingApplicationWhoAreYou? bsr_whoareyou = null);