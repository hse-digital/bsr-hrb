using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSEPortal.API.Model.Payment.Request;
public class PaymentApiRequestModel
{
    public int amount { get; set; }
    public string reference { get; set; }
    public string return_url { get; set; }
    public string description { get; set; }
    public string email { get; set; }

    public prefilled_cardholder_details prefilled_cardholder_details = new prefilled_cardholder_details();
    public string language { get; set; }

}

public class prefilled_cardholder_details
{
    public string cardholder_name { get; set; }
    public billing_address billing_address = new billing_address();
}

public class billing_address
{
    public string line1 { get; set; }
    public string line2 { get; set; }
    public string postcode { get; set; }
    public string city { get; set; }
    public string country { get; set; }
}
