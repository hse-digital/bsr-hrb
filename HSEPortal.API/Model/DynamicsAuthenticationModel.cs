using System.Text.Json.Serialization;

namespace HSEPortal.API.Model;

public class DynamicsAuthenticationModel
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }
}