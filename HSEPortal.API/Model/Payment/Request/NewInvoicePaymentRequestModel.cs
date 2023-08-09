namespace HSEPortal.API.Model.Payment.Request;

public class NewInvoicePaymentRequestModel
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string AddressLine1 { get; set; }
    public string AddressLine2 { get; set; }
    public string Town { get; set; }
    public string Postcode { get; set; }
    public string OrderNumber { get; set; }
}