namespace HSEPortal.API.Model.Sync;

public record SyncKbiFireAndEnergyMessage(KbiSectionModel SectionModel,string ApplicationId) : SyncMessage(ApplicationId)
{
    public const string QueueName = "sync-kbi-fire-energy";
}