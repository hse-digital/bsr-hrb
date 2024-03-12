using System.Net;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
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
    private readonly DynamicsService dynamicsService;
    private readonly BlobOptions blobOptions;
    private readonly IntegrationsOptions integrationOptions;

    public BlobEndpoints(BlobServiceClient blobServiceClient, IOptions<BlobOptions> blobOptions,
        IOptions<IntegrationsOptions> integrationOptions, DynamicsService dynamicsService)
    {
        this.blobServiceClient = blobServiceClient;
        this.dynamicsService = dynamicsService;
        this.blobOptions = blobOptions.Value;
        this.integrationOptions = integrationOptions.Value;
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
    public async Task<HttpResponseData> TriggerFileScan([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData requestData)
    {
        var scanRequest = await requestData.ReadAsJsonAsync<ScanAndUploadRequest>();
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
    public async Task<HttpResponseData> UploadToSharepoint([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData requestData)
    {
        var scanRequest = await requestData.ReadAsJsonAsync<ScanAndUploadRequest>();

        var uploadModel = await CreateTaskDocument(scanRequest.ApplicationId, scanRequest.BlobName, scanRequest.TargetTable);
        return await requestData.CreateObjectResponseAsync(uploadModel);
    }

    private async Task DeleteBlobAsync(string blobName)
    {
        var client = blobServiceClient.GetBlobContainerClient(blobOptions.ContainerName)!;
        await client.DeleteBlobAsync(blobName);
    }

    private async Task<SharepointUploadRequestModel> CreateTaskDocument(string applicationId, string blobName, string targetTable)
    {
        var buildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationId);
        var targetRecordId = buildingApplication.bsr_buildingapplicationid;

        if (targetTable == "bsr_bacapplication")
        {
            var bacApplication = await dynamicsService.GetBacApplication(buildingApplication.bsr_buildingapplicationid);
            targetRecordId = bacApplication.bsr_bacapplicationid;
        }

        var sharepointUploadRequestModel = new SharepointUploadRequestModel
        {
            fileName = blobName,
            subFolderPath = "BSR User Uploads",
            fileDescription = "Uploaded from HSE Portal",
            providerContactId = buildingApplication._bsr_registreeid_value,
            targetRecordId = targetRecordId,
            targetTable = targetTable,
            azureBlobFilePath = $"{blobOptions.ContainerName}/{blobName}"
        };
        await dynamicsService.UploadFileToSharepoint(sharepointUploadRequestModel);

        await DeleteBlobAsync(blobName);
        return sharepointUploadRequestModel;
    }
}

public class ScanAndUploadRequest
{
    public string ApplicationId { get; set; }
    public string BlobName { get; set; }
    public string TargetTable { get; set; }
}

public record FileUploadStatus(string id, string ContainerName, string Application, string FileName, bool Success);