namespace HSEPortal.API.Model.Sync;

public record SyncKbiConnectionsAndDeclarationMessage(KbiModel KbiModel, string ApplicationId) : SyncMessage(ApplicationId)
{
    public const string QueueName = "sync-kbi-connections";
}