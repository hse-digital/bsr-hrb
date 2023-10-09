using HSEPortal.API.BlobStore;
using HSEPortal.API.Extensions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Functions;

public class UploadFilesFunction
{
    private readonly IBlobSASUri blobSASUri;

    public UploadFilesFunction(IBlobSASUri blobSASUri)
    {
        this.blobSASUri = blobSASUri;
    }

    [Function(nameof(GetSASUri))]
    public async Task<HttpResponseData> GetSASUri([HttpTrigger(AuthorizationLevel.Anonymous, "get", 
        Route = $"{nameof(GetSASUri)}/{{caseId}}/{{blobName}}")] HttpRequestData request, string caseId, string blobName)
    {
        var blobString = blobSASUri.GetSASUri($"{caseId}/{blobName}");

        return await BuildResponseObjectAsync(request, blobString);
    }   
    private async Task<HttpResponseData> BuildResponseObjectAsync(HttpRequestData request, string response)
    {
        return await request.CreateObjectResponseAsync(response);
    }
    private async Task<HttpResponseData> BuildFileResponseObjectAsync(HttpRequestData request, string response)
    {
        return await request.CreateObjectResponseAsync(response);
    }     
}

public class FileResponse
{
    public string FileName { get; set; }
    public string URL { get; set; }
}
