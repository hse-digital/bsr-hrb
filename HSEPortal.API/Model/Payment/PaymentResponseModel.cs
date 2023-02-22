using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSEPortal.API.Model.Payment;

public class PaymentResponseModel
{
    public string CreatedDate;
    public string Status;
    public bool Finished;
    public string LinkSelf;
    public int Amount;
    public string Reference;
    public string Description;
    public string ReturnURL;
    public string PaymentId;
    public string PaymentProvider;
    public string ProviderId;
}
