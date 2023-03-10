using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record LocalAuthority(string context, LocalAuthorityValue[] value, string Id = null) : Entity(Id);

public record LocalAuthorityValue(string etag, string name, string accountid) : Entity(accountid);

public record DynamicsLocalAuthority(
    [property: JsonPropertyName("@odata.context")]
    string context,
    DynamicsLocalAuthorityValue[] value, string Id = null) : DynamicsEntity<LocalAuthority>;

public record DynamicsLocalAuthorityValue(
    [property: JsonPropertyName("@odata.etag")]
    string etag,
    string name, string accountid) : DynamicsEntity<LocalAuthorityValue>;