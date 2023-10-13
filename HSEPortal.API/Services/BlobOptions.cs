namespace HSEPortal.API.Services;

public class BlobOptions
{
    public const string SectionName = "Blob";
    public string ConnectionString { get; set; }
    public string ContainerName { get; set; }
}