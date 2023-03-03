using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSEPortal.API.Model.Payment.Response;

public class PaymentResponseModel
{
    public string CreatedDate { get; set; }
    public string Status { get; set; }
    public bool Finished { get; set; }
    public string LinkSelf { get; set; }
    public int Amount { get; set; }
    public string Reference { get; set; }
    public string Description { get; set; }
    public string ReturnURL { get; set; }
    public string PaymentId { get; set; }
    public string PaymentProvider { get; set; }
    public string ProviderId { get; set; }
}
