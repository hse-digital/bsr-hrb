namespace HSEPortal.API.Model.Sync;

public record SyncAccountablePersonsMessage(BuildingApplicationModel ApplicationModel) : SyncMessage(ApplicationModel.Id)
{
    public const string QueueName = "sync-accountable-persons";
}