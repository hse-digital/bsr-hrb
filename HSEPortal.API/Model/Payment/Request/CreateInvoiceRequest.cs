namespace HSEPortal.API.Model.Payment.Request;

public class CreateInvoiceRequest
{
    public string CustomerId { get; set; } = null!;
    public string PaymentId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string AddressLine1 { get; set; } = null!;
    public string AddressLine2 { get; set; } = null!;
    public string Town { get; set; } = null!;
    public string Postcode { get; set; } = null!;
    public string Application { get; set; } = null!;
    public string Environment { get; set; } = null!;
    public string? OrderNumber { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public double Amount { get; set; }
}