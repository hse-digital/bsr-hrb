namespace HSEPortal.API.Model.Sync;

public record SyncCertificateDeclarationMessage(BuildingApplicationModel ApplicationModel) : SyncMessage(ApplicationModel.Id)
{
    public const string QueueName = "sync-certificate-declaration";
}