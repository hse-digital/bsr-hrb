namespace HSEPortal.API.Services;

public class DynamicsOptions
{
    public const string Dynamics = "Dynamics";
    
    public string EnvironmentUrl { get; set; }
    public string TenantId { get; set; }
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }
    public string EmailVerificationFlowUrl { get; set; }
    public string AccountId { get; set; }
}