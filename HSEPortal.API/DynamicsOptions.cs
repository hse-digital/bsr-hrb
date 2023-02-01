namespace HSEPortal.API;

public class DynamicsOptions
{
    public const string Dynamics = "Dynamics";
    
    public string EnvironmentUrl { get; set; }
    public string TenantId { get; set; }
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }
}