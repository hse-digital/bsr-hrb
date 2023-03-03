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

}