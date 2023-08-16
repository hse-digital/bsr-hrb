namespace HSEPortal.API.Services;

public class IntegrationsOptions
{
    public const string Integrations = "Integrations";
    
    public string OrdnanceSurveyEndpoint { get; set; }
    public string OrdnanceSurveyApiKey { get; set; }
    public string CompaniesHouseEndpoint { get; set; }
    public string CompaniesHouseApiKey { get; set; }
    public string PaymentEndpoint { get; set; }
    public string PaymentApiKey { get; set; }
    public double PaymentAmount { get; set; }
    public string CommonAPIEndpoint { get; set; }
    public string CommonAPIKey { get; set; }
    public string Environment { get; set; }
}