namespace HSEPortal.API.Model.Sync;

public record SyncKbiBuildingUseMessage(KbiSectionModel SectionModel, string ApplicationId) : SyncMessage(ApplicationId)
{
    public const string QueueName = "sync-kbi-building-use";
}