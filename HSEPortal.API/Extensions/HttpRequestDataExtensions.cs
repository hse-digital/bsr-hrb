using System.Net;
using System.Text.Json;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Extensions;

public static class HttpRequestDataExtensions
{
    public static async Task<T> ReadAsJsonAsync<T>(this HttpRequestData httpRequestData)
    {
        return await JsonSerializer.DeserializeAsync<T>(httpRequestData.Body);
    }
    
    public static async Task<HttpResponseDataWithCosmosDocument> BuildValidationErrorResponseDataAsync(this HttpRequestData httpRequestData, ValidationSummary validationSummary)
    {
        var stream = new MemoryStream();
        await JsonSerializer.SerializeAsync(stream, validationSummary);
        
        stream.Flush();
        stream.Seek(0, SeekOrigin.Begin);

        var badRequestResponse = httpRequestData.CreateResponse(HttpStatusCode.BadRequest);
        badRequestResponse.Body = stream;

        return new HttpResponseDataWithCosmosDocument
        {
            HttpResponse = badRequestResponse
        };
    }
}