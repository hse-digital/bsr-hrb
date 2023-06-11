using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record DynamicsFireAndSmokeProvisions
{
    public string bsr_blockfiresmokeprovisionid { get; set; }
    
    [property: JsonPropertyName("bsr_BlockId@odata.bind")]
    public string blockId { get; set; }

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
}

public record DynamicsStructureMaterial
{
    [property: JsonPropertyName("bsr_structure@odata.bind")]
    public string structureId { get; set; }
    
    [property: JsonPropertyName("bsr_material@odata.bind")]
    public string materialId { get; set; }

    public int? bsr_aluminiumcompositematerialacm { get; set; }
    public int? bsr_highpressurelaminatehpl { get; set; }
    public int? bsr_percentageofmaterial { get; set; }
    public string bsr_otherspecifiedmaterial { get; set; }
}

public record DynamicsExternalFeature
{
    [property: JsonPropertyName("bsr_BlockId@odata.bind")]
    public string structureId { get; set; }
    
    [property: JsonPropertyName("bsr_ExternalFeatureTypeId@odata.bind")]
    public string featureId { get; set; }
    
    [property: JsonPropertyName("bsr_MaterialId@odata.bind")]
    public string materialId { get; set; }
}

public record DynamicsStructureUse
{
    [property: JsonPropertyName("@odata.id")]
    public string relationshipId { get; set; }
    
    public string bsr_blockuseid { get; set; }
}

public record DynamicsStructureWork
{
    [property: JsonPropertyName("bsr_structure@odata.bind")]
    public string structureId { get; set; }
    
    [property: JsonPropertyName("bsr_buildingwork@odata.bind")]
    public string workId { get; set; }
    
    [property: JsonPropertyName("bsr_material@odata.bind")]
    public string materialId { get; set; }
}

public record DynamicsConnectedStructure
{
    public int? bsr_buildingconnection { get; set; }
    
    [property: JsonPropertyName("bsr_building@odata.bind")]
    public string buildingId { get; set; }

    [property: JsonPropertyName("bsr_StructureConnectionTypeId@odata.bind")]
    public string connectionTypeId { get; set; }
}