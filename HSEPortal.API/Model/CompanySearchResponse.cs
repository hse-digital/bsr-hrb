namespace HSEPortal.API.Model;

public class CompanySearchResponse
{
    public CompanySearchResponse()
    {
        Companies = new List<Company>();
    }
    
    public List<Company> Companies { get; set; }
    public int Results { get; set; }
}

public class Company
{
    public string Name { get; set; }
    public string Number { get; set; }
    public string Status { get; set; }
    public string Type { get; set; }
}