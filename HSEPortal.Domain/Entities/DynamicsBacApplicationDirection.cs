using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record DynamicsBacApplicationDirection
{
    [property:JsonPropertyName("bsr_bacapplicationid@odata.bind")]
    public string bacApplicationReferenceId { get; set; }
    public string bsr_bacapplicationdirectionid { get; set; }
    public string bsr_name { get; set; }
    public DateTime? bsr_date { get; set; }
    public int? statecode { get; set; }
    public int? statuscode { get; set; }
    public string _bsr_buildingid_value { get; set; }
    public DateTime? bsr_submissionrequesteddate { get; set; }
}

public record DynamicsBacApplication
{
    public string bsr_bacapplicationid { get; set; }
    public int? bsr_bacstageid { get; set; }
    public int? statuscode { get; set; }
    public int? bsr_validationoutcomecode { get; set; }
    
    [property:JsonPropertyName("bsr_buildingapplicationid@odata.bind")]
    public string buildingApplicationReference { get; set; }
    
    [property:JsonPropertyName("bsr_buildingid@odata.bind")]
    public string buildingReference { get; set; }
    public bool? bsr_declaration { get; set; }
    public string bsr_purchaseordernumber { get; set; }
    
    [property:JsonPropertyName("bsr_dutyholderid@odata.bind")]
    public string dutyHolderReferenceId { get; set; }
}