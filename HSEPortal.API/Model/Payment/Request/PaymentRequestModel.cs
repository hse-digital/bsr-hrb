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

    public string Email { get; set; }
    public string CardholderName { get; set; }
    public string AddressLineOne { get; set; }
    public string AddressLineTwo { get; set; }
    public string Postcode { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string Language { get; set; }
}
