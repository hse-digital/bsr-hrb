namespace HSEPortal.API.Model.CompaniesHouse;

public class CompaniesHouseSearchResponse
{
    public List<CompanyItem> items { get; set; }
    public int hits { get; set; }
}

public class CompanyItem
{
    public string company_name { get; set; }
    public string company_number { get; set; }
    public string company_status { get; set; }
    public string company_type { get; set; }
}