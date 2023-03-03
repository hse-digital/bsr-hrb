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
}

public class State
{
    public string status { get; set; }
    public bool finished { get; set; }
}

public class Links
{
    public Url self { get; set; }
    public Url next_url { get; set; }
}

public class Url
{
    public string href { get; set; }
    public string method { get; set; }
}
