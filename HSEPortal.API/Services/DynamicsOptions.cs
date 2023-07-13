namespace HSEPortal.API.Services;

public class DynamicsOptions
{
    public const string Dynamics = "Dynamics";
    
    public string EnvironmentUrl { get; set; }
    public string TenantId { get; set; }
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }
    public string EmailVerificationFlowUrl { get; set; }
    public string LocalAuthorityTypeId { get; set; }
    public const string SocialHousingTypeId = "64866e32-1dad-ed11-83ff-0022481b5e4f";
}