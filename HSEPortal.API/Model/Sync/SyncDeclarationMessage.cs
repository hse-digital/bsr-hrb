namespace HSEPortal.API.Model.Sync;

public record SyncDeclarationMessage(BuildingApplicationModel ApplicationModel) : SyncMessage(ApplicationModel.Id)
{
    public const string QueueName = "sync-declaration";
}