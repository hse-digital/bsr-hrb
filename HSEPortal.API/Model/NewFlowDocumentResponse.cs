namespace HSEPortal.API.Model;

public record NewFlowDocumentResponse(long sharePointFileId, string bsr_documentid);

public record SharepointUploadRequestModel
{
    public string? fileName { get; set; }
    public string? subFolderPath { get; set; }
    public string? fileDescription { get; set; }
    public string? providerContactId { get; set; }
    public string? targetRecordId { get; set; }
    public string? targetTable { get; set; }
    public string? azureBlobFilePath { get; set; }
}