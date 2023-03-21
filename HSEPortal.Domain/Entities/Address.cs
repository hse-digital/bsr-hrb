using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record DynamicsAddress(string bsr_line1 = null, string bsr_line2 = null, string bsr_city = null, string bsr_postcode = null, string bsr_uprn = null, string bsr_usrn = null, 
    AddressType? bsr_addresstypecode = null, YesNoOption? bsr_manualaddress = null, 
    [property: JsonPropertyName("bsr_independentsectionid@odata.bind")]
    string structureReferenceId = null);