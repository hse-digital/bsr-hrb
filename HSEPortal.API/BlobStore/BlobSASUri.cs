using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using HSE.BsrHelp.API.Services;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.BlobStore;

public interface IBlobSASUri 
{
    string GetSASUri(string blobName);
}
public class BlobSASUri : IBlobSASUri
{
    private readonly IBlobClient blobClient;
    private readonly BlobStoreOptions blobStoreOptions;

    public BlobSASUri(IBlobClient blobClient, IOptions<BlobStoreOptions> blobStoreOptions)
    {
        this.blobClient = blobClient;
        this.blobStoreOptions = blobStoreOptions.Value;
    }

    public string GetSASUri(string blobName)
    {        
        var blobServiceClient = new BlobServiceClient(blobStoreOptions.ConnectionString);

        //  Gets a reference to the container.
        var containerClient = blobServiceClient.GetBlobContainerClient(blobStoreOptions.ContainerName);

        //  Gets a reference to the blob in the container
        BlobClient blobClient = containerClient.GetBlobClient(blobName);
        Uri fullUri = blobClient.GenerateSasUri(BlobSasPermissions.All, DateTime.UtcNow.AddDays(1));

        return fullUri.ToString();
    }
}
