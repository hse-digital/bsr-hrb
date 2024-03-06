namespace HSEPortal.API.Model.Sync;

public record SyncBuildingStructuresMessage(BuildingApplicationModel ApplicationModel) : SyncMessage(ApplicationModel.Id)
{
    public const string QueueName = "sync-building-structures";
}