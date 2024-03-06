namespace HSEPortal.API.Model.Sync;

public record SyncKbiStructureRoofStaircasesAndWallsMessage(KbiSectionModel SectionModel,string ApplicationId) : SyncMessage(ApplicationId)
{
    public const string QueueName = "sync-kbi-roof";
}