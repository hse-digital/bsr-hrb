using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record DynamicsFireAndSmokeProvisions
{
    public string bsr_blockfiresmokeprovisionid { get; set; }
    public string _bsr_blockid_value { get; set; }

    [property: JsonPropertyName("bsr_FireSmokeProvisionId@odata.bind")]
    public string bsr_FireSmokeProvisionId { get; set; }

    [property: JsonPropertyName("bsr_ResidentialAreaId@odata.bind")]
    public string bsr_ResidentialAreaId { get; set; }
}

public record DynamicsStructureLift
{
    public string bsr_structureliftid { get; set; }
    
    [property: JsonPropertyName("bsr_lifts@odata.bind")]
    public string liftId { get; set; }
    
    [property: JsonPropertyName("bsr_structure@odata.bind")]
    public string structureId { get; set; }
}

public record DynamicsStructureEnergy
{
    public string bsr_structureenergyId { get; set; }
    
    [property: JsonPropertyName("bsr_energy@odata.bind")]
    public string energyId { get; set; }
    
    [property: JsonPropertyName("bsr_structure@odata.bind")]
    public string structureId { get; set; }
    
    public long bsr_energytype { get; set; }
}