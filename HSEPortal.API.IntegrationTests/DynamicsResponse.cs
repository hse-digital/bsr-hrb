using System.Text.Json.Serialization;

namespace HSEPortal.API.IntegrationTests;

public class DynamicsResponse<T>
{
    [JsonPropertyName("value")]
    public ICollection<T> Value { get; set; } 
}