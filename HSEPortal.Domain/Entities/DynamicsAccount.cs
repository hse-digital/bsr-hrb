using System.Text.Json.Serialization;

namespace HSEPortal.Domain.Entities;

public record DynamicsAccount(string name = null, string accountid = null,
    string address1_line1 = null, string address1_line2 = null, string address1_city = null, string address1_postalcode = null, 
    [property: JsonPropertyName("bsr_Address1CountryCode@odata.bind")]
    string countryReferenceId = null,
    [property: JsonPropertyName("bsr_accounttype_accountId@odata.bind")]
    string acountTypeReferenceId = null,
    string bsr_otherorganisationtype = null,
    YesNoOption? bsr_manualaddress = null);

public static class DynamicsAccountType
{
    public static readonly IDictionary<string, string> Ids = new Dictionary<string, string>
    {
        ["commonhold-association"] = "a45704fb-1cad-ed11-83ff-0022481b5e4f",
        ["housing-association"] = "64866e32-1dad-ed11-83ff-0022481b5e4f",
        ["local-authority"] = "db305f3e-1dad-ed11-83ff-0022481b5e4f",
        ["management-company"] = "92c98d4a-1dad-ed11-83ff-0022481b5e4f",
        ["rmc-or-organisation"] = "20df1269-1dad-ed11-83ff-0022481b5e4f",
        ["rtm-or-organisation"] = "50f0899f-1dad-ed11-83ff-0022481b5e4f",
        ["other"] = "453982a5-1dad-ed11-83ff-0022481b5e4f"
    };
}