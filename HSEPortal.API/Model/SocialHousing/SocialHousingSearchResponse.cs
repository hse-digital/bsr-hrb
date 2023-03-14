namespace HSEPortal.API.Model.SocialHousing;

public record SocialHousingSearchResponse(int count, SocialHousingRecord[] results);

public class SocialHousingRecord
{
    public string organisation_name { get; init; }
    public string registration_number { get; init; }
    public string registration_date { get; init; }
    public string designation { get; init; }
    public string corporate_form { get; init; }
}