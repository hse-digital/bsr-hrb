using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSEPortal.API.Model.Payment.Response;

public class PaymentApiResponseModel
{
    public string created_date { get; set; }
    public State state { get; set; }
    public Links _links { get; set; }
    public int amount { get; set; }
    public string reference { get; set; }
    public string description { get; set; }
    public string return_url { get; set; }
    public string payment_id { get; set; }
    public string payment_provider { get; set; }
    public string provider_id { get; set; }
    public CardDetails card_details { get; set; }
}

public class State
{
    public string status { get; set; }
    public bool finished { get; set; }
}

public class Links
{
    public Url self { get; set; }
}

public class Url
{
    public string href { get; set; }
}

public class CardDetails
{
    public int last_digits_card_number { get; set; }
    public string expiry_date { get; set; }
    public string card_brand { get; set; }
    public string card_type { get; set; }
    public BillingAddress billing_address { get; set; }

}

public class BillingAddress
{
    public string line1 { get; set; }
    public string line2 { get; set; }
    public string postcode { get; set; }
    public string city { get; set; }
    public string country { get; set; }
}