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
    public string PaymentLink { get; set; }
    public int Amount { get; set; }
    public string Reference { get; set; }
    public string Description { get; set; }
    public string ReturnURL { get; set; }
    public string PaymentId { get; set; }
    public string PaymentProvider { get; set; }
    public string ProviderId { get; set; }
    public int LastFourDigitsCardNumber { get; set; }
    public string CardExpiryDate { get; set; }
    public string CardBrand { get; set; }
    public string CardType { get; set; }
    public string AddressLineOne { get; set; }
    public string AddressLineTwo { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string Postcode { get; set; }
}