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

    public static async Task<T> ReadAsJsonAsync<T>(this HttpResponseData httpRequestData)
    {
        return await JsonSerializer.DeserializeAsync<T>(httpRequestData.Body);
    }

    public static async Task<HttpResponseData> CreateObjectResponseAsync<T>(this HttpRequestData httpRequestData, T @object)
    { 
        var stream = new MemoryStream();
        await JsonSerializer.SerializeAsync(stream, @object);

        stream.Flush();
        stream.Seek(0, SeekOrigin.Begin);

        var response = httpRequestData.CreateResponse(HttpStatusCode.OK);
        response.Body = stream;

        return response;
    }

    public static async Task<CustomHttpResponseData> BuildValidationErrorResponseDataAsync(this HttpRequestData httpRequestData, ValidationSummary validationSummary)
    {
        var stream = new MemoryStream();
        await JsonSerializer.SerializeAsync(stream, validationSummary);

        stream.Flush();
        stream.Seek(0, SeekOrigin.Begin);

        var badRequestResponse = httpRequestData.CreateResponse(HttpStatusCode.BadRequest);
        badRequestResponse.Body = stream;

        return new CustomHttpResponseData
        {
            HttpResponse = badRequestResponse
        };
    }
}