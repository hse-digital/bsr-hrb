namespace HSEPortal.API.Model.Sync;

public record SyncPaymentMessage(BuildingApplicationModel ApplicationModel) : SyncMessage(ApplicationModel.Id)
{
    public const string QueueName = "sync-payment";
}