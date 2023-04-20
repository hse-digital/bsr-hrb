namespace HSEPortal.API.Model.Payment.Request;

public class PaymentApiRequestModel
{
    public double amount { get; set; }
    public string reference { get; set; }
    public string return_url { get; set; }
    public string description { get; set; }
    public bool delayed_capture = false;
    public string email { get; set; }
    public ApiCardHolderDetails prefilled_cardholder_details { get; set; }
}

public class ApiCardHolderDetails
{
    public string cardholder_name { get; set; }
    public ApiCardHolderAddress billing_address { get; set; }
}

public class ApiCardHolderAddress
{
    public string line1 { get; set; }
    public string line2 { get; set; }
    public string postcode { get; set; }
    public string city { get; set; }
}