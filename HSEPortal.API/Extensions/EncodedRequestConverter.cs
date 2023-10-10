using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker.Converters;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Extensions;

public record EncodedRequest
{
    public string? Body { get; set; }
    
    [JsonPropertyName("userId")]
    public string? UserId { get; set; }
    
    [JsonPropertyName("userRoles")]
    public string[]? UserRoles { get; set; }
    
    [JsonPropertyName("identityProvider")]
    public string? IdentityProvider { get; set; }
    
    [JsonPropertyName("userDetails")]
    public string? UserDetails { get; set; }
    
    public DynamicsContact? Contact { get; set; }

    public T? GetDecodedData<T>() where T : class
    {
        if (string.IsNullOrEmpty(Body)) return null;

        var content = Body;
        if (Body.StartsWith("base64:"))
        {
            content = Uri.UnescapeDataString(Encoding.UTF8.GetString(Convert.FromBase64String(content[7..])));
        }

        return JsonSerializer.Deserialize<T>(content);
    }
}

// public class EncodedRequestConverter : IInputConverter
// {
//     private readonly DynamicsApi dynamicsApi;

//     public EncodedRequestConverter(DynamicsApi dynamicsApi)
//     {
//         this.dynamicsApi = dynamicsApi;
//     }
    
//     public async ValueTask<ConversionResult> ConvertAsync(ConverterContext context)
//     {
//         try
//         {
//             var req = context!.FunctionContext.GetHttpRequestData()!;
//             var reqHeader = req.Headers.FirstOrDefault(x => x.Key == "x-ms-client-principal");

//             var data = reqHeader.Value.First();
//             var decoded = Convert.FromBase64String(data);
//             var json = Encoding.UTF8.GetString(decoded);
//             var encodedRequest = JsonSerializer.Deserialize<EncodedRequest>(json)!;
//             var externalIdentity = await dynamicsApi.GetExternalIdentity(encodedRequest.UserId); 
            
//             var body = await req.ReadAsStringAsync();
//             encodedRequest = encodedRequest with { Contact = externalIdentity.bsr_contactid, Body = body };
            
//             return ConversionResult.Success(encodedRequest);
//         }
//         catch (Exception e)
//         {
//             return ConversionResult.Failed(e);
//         }
//     }
// }