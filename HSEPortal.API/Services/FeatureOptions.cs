namespace HSEPortal.API.Services;

public class FeatureOptions
{
    public const string Feature = nameof(Feature);
    
    public bool DisableOtpValidation { get; set; }
    public bool EnablePublicRegisterPasswordProtection { get; set; }
}