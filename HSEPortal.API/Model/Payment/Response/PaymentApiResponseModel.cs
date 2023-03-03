using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSEPortal.API.Model.Payment.Response;

public class PaymentApiResponseModel
{
    public string created_date;
    public State state;
    public Links _links;
    public int amount;
    public string reference;
    public string description;
    public string return_url;
    public string payment_id;
    public string payment_provider;
    public string provider_id;
}

public class State
{
    public string status;
    public bool finished;
}

public class Links
{
    public Url self;
    public Url next_url;
}

public class Url
{
    public string href;
    public string method;
}
