using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record DynamicsAccountablePerson(DynamicAccountablePersonType? bsr_accountablepersontype = null,
    [property: JsonPropertyName("bsr_apid_account@odata.bind")]
    string papAccountReferenceId = null,
    [property: JsonPropertyName("bsr_apid_contact@odata.bind")]
    string papContactReferenceId = null,
    [property: JsonPropertyName("bsr_Independentsection@odata.bind")]
    string structureReferenceId = null,
    [property: JsonPropertyName("bsr_SectionArea@odata.bind")]
    string sectionAreaReferenceId = null,
    [property:JsonPropertyName("bsr_APOrgLeadContact@odata.bind")]
    string leadContactReferenceId = null);

public enum DynamicAccountablePersonType
{
    Individual = 760_810_000,
    Organisation = 760_810_001
}