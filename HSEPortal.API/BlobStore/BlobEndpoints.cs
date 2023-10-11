using System.Net;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Cloudmersive.APIClient.NETCore.VirusScan.Api;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.BlobStore;

public class BlobEndpoints
{
    private readonly BlobServiceClient blobServiceClient;
    private readonly IScanApi scanApi;
    private readonly DynamicsApi dynamicsApi;
    private readonly BlobOptions blobOptions;
    private readonly DynamicsOptions dynamicsOptions;
    private readonly IntegrationsOptions integrationOptions;
    private readonly SharepointOptions sharepointOptions;

    public BlobEndpoints(BlobServiceClient blobServiceClient, IScanApi scanApi, IOptions<BlobOptions> blobOptions, IOptions<DynamicsOptions> dynamicsOptions,
        IOptions<IntegrationsOptions> integrationOptions, IOptions<SharepointOptions> sharepointOptions, DynamicsApi dynamicsApi)
    {
        this.blobServiceClient = blobServiceClient;
        this.scanApi = scanApi;
        this.dynamicsApi = dynamicsApi;
        this.blobOptions = blobOptions.Value;
        this.dynamicsOptions = dynamicsOptions.Value;
        this.integrationOptions = integrationOptions.Value;
        this.sharepointOptions = sharepointOptions.Value;
    }

    [Function(nameof(GetSasUri))]
    public async Task<HttpResponseData> GetSasUri([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(GetSasUri)}/{{*blobName}}")] HttpRequestData requestData, string blobName)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(blobOptions.ContainerName);

        var blobClient = containerClient.GetBlobClient(blobName);
        var fullUri = blobClient.GenerateSasUri(BlobSasPermissions.Write | BlobSasPermissions.Delete, DateTime.UtcNow.AddDays(1));

        return await requestData.CreateObjectResponseAsync(new { blobUri = fullUri });
    }

    [Function(nameof(TriggerFileScan))]
    public async Task<HttpResponseData> TriggerFileScan([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData requestData, EncodedRequest encodedRequest)
    {
        var scanRequest = encodedRequest.GetDecodedData<ScanAndUploadRequest>()!;
        var fileScanId = Guid.NewGuid().ToString();

        await integrationOptions.CommonAPIEndpoint.AppendPathSegments("api", "ScanFile")
            .WithHeader("x-functions-key", integrationOptions.CommonAPIKey)
            .PostJsonAsync(new { id = fileScanId, ContainerName = blobOptions.ContainerName, FileName = scanRequest.BlobName, Application = "hseportal" });

        return await requestData.CreateObjectResponseAsync(new { scanId = fileScanId });
    }

    [Function(nameof(GetFileScanResult))]
    public async Task<FileUploadStatus> GetFileScanResult([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData requestData)
    {
        var id = requestData.GetQueryParameters()["id"];

        var response = await integrationOptions.CommonAPIEndpoint.AppendPathSegments("api", "GetFileScanResult")
            .SetQueryParam("id", id)
            .WithHeader("x-functions-key", integrationOptions.CommonAPIKey)
            .AllowAnyHttpStatus()
            .GetAsync();

        if (response.StatusCode != (int)HttpStatusCode.Created) return null;

        return await response.GetJsonAsync<FileUploadStatus>();
    }

    [Function(nameof(UploadToSharepoint))]
    public async Task<HttpResponseData> UploadToSharepoint([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData requestData, EncodedRequest encodedRequest)
    {
        var scanRequest = encodedRequest.GetDecodedData<ScanAndUploadRequest>()!;

        await CreateTaskDocument(scanRequest.BuildingControlApplicationId, scanRequest.BlobName, encodedRequest);
        return requestData.CreateResponse(HttpStatusCode.OK);
    }

    [Function(nameof(DownloadFile))]
    public async Task<HttpResponseData> DownloadFile([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData requestData)
    {
        var fileName = requestData.GetQueryParameters()["fileName"];

        var response = await integrationOptions.CommonAPIEndpoint.AppendPathSegments("api", "GetSharepointFileDownloadUrl")
            .SetQueryParams(new { siteId = sharepointOptions.SiteId, driveId = sharepointOptions.DriveId, fileName = fileName })
            .WithHeader("x-functions-key", integrationOptions.CommonAPIKey)
            .AllowHttpStatus(HttpStatusCode.NotFound)
            .GetAsync();

        if (response.StatusCode == (int)HttpStatusCode.NotFound)
        {
            return requestData.CreateResponse(HttpStatusCode.NotFound);
        }

        var graphFile = await response.GetJsonAsync<GraphFile>();
        return await requestData.CreateObjectResponseAsync(graphFile);
    }

    private async Task DeleteBlobAsync(string blobName)
    {
        var client = blobServiceClient.GetBlobContainerClient(blobOptions.ContainerName)!;
        await client.DeleteBlobAsync(blobName);
    }

    private async Task CreateTaskDocument(string buildingControlApplicationId, string blobName, EncodedRequest appUser)
    {
        var flowDocumentResponse = await integrationOptions.CommonAPIEndpoint.AppendPathSegments("api", "UploadToSharepoint")
            .WithHeader("x-functions-key", integrationOptions.CommonAPIKey).PostJsonAsync(new
            {
                fileName = blobName,
                subFolderPath = "BSR User Uploads",
                fileDescription = "Uploaded from HSE Portal",
                providerContactId = appUser.Contact.contactid,
                targetRecordId = buildingControlApplicationId,
                targetTable = "bsr_buildingapplication",
                azureBlobFilePath = $"{blobOptions.ContainerName}/{blobName}"
            }).ReceiveJson<NewFlowDocumentResponse>();

        await DeleteBlobAsync(blobName);
        //await dynamicsApi.CreateTaskDocument(flowDocumentResponse.bsr_documentid, buildingControlApplicationId);
    }
}

public record ScanAndUploadRequest(string BuildingControlApplicationId, string TaskId, string BlobName);

public record FileUploadStatus(string id, string ContainerName, string Application, string FileName, bool Success);