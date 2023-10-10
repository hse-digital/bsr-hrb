using System.Text.Json.Serialization;

namespace HSEPortal.API.Model;

public class GraphFile
{
    public string id { get; set; }
    public string name { get; set; }
    public string webUrl { get; set; }
    
    [JsonPropertyName("@microsoft.graph.downloadUrl")]
    public string downloadUrl { get; set; }
}