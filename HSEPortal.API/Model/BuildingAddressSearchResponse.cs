namespace HSEPortal.API.Model;

public class BuildingAddressSearchResponse
{
    public int Offset { get; init; }
    public int MaxResults { get; init; }
    public int TotalResults { get; init; }
    public BuildingAddress[] Results { get; set; }
}

public class BuildingAddress
{
    public string UPRN { get; init; }
    public string USRN { get; init; }
    public string Address { get; init; }
    public string AddressLineTwo { get; init; }
    public string BuildingName { get; init; }
    public string Number { get; init; }
    public string Street { get; init; }
    public string Town { get; init; }
    public string Country { get; init; }
    public string AdministrativeArea { get; init; }
    public string Postcode { get; init; }
    public bool IsManual { get; init; }
}