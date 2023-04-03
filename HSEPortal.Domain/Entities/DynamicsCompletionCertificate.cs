using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record DynamicsCompletionCertificate(string bsr_completioncertificateid = null, string bsr_name = null, string bsr_issuingorganisation = null, string bsr_certificatereferencenumber = null,
    [property: JsonPropertyName("bsr_independentsectionid@odata.bind")]
    string structureReferenceId = null);