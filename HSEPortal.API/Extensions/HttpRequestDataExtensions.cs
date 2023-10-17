using System.Collections.Specialized;
using System.Net;
using System.Text;
using System.Text.Json;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Extensions;

public static class HttpRequestDataExtensions
{
    public static async Task<T> ReadAsJsonAsync<T>(this HttpRequestData httpRequestData)
    {
        var requestContent = await httpRequestData.ReadAsStringAsync();
        if (string.IsNullOrEmpty(requestContent)) return default;

        if (requestContent.StartsWith("base64:"))
        {
            requestContent = Uri.UnescapeDataString(Encoding.UTF8.GetString(Convert.FromBase64String(requestContent[7..])));
        }

        requestContent = requestContent.Replace("&39", "'");
        return JsonSerializer.Deserialize<T>(requestContent);
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

        return new CustomHttpResponseData { HttpResponse = badRequestResponse };
    }

    public static NameValueCollection GetQueryParameters(this HttpRequestData request)
    {
        return System.Web.HttpUtility.ParseQueryString(request.Url.Query);
    }
}