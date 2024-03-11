namespace HSEPortal.API.Model.Sync;

public record CreateBacSyncMessage(BuildingApplicationModel ApplicationModel) : SyncMessage(ApplicationModel.Id)
{
    public const string QueueName = "create-bac";
}

public record UpdateBacSyncMessage(BuildingApplicationModel ApplicationModel) : SyncMessage(ApplicationModel.Id)
{
    public const string QueueName = "update-bac";
}

public record SyncBacStatusMessage(BuildingApplicationModel ApplicationModel) : SyncMessage(ApplicationModel.Id)
{
    public const string QueueName = "sync-bac-status";
}