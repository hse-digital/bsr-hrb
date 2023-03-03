using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSEPortal.API.Model.Payment.Request;

public class PaymentRequestModel
{
    public int Amount { get; set; }
    public string Reference { get; set; }
    public string ReturnLink { get; set; }
    public string Description { get; set; }

}
