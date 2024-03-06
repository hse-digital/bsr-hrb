namespace HSEPortal.API.Model.Sync;

public record SyncKbiStartMessage(KbiSectionModel SectionModel, string ApplicationId) : SyncMessage(ApplicationId)
{
    public const string QueueName = "sync-kbi-start";
}