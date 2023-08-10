using System.Text.Json.Serialization;

namespace HSEPortal.API.Model.Payment;

public class InvoicePaidEventData
{
    [JsonPropertyName("id")]
    public string EventId { get; set; } = null!;
    
    [JsonPropertyName("type")]
    public string EventType { get; set; } = null!;

    [JsonPropertyName("data")]
    public InvoiceObjectData Data { get; set; } = null!;
}

public class InvoiceObjectData
{
    [JsonPropertyName("object")]
    public InvoiceData InvoiceData { get; set; } = null!;
}

public class InvoiceData
{
    [JsonPropertyName("id")]
    public string InvoiceId { get; set; } = null!;
    
    [JsonPropertyName("account_country")]
    public string AccountCountry { get; set; } = null!;
    
    [JsonPropertyName("account_name")]
    public string AccountName { get; set; } = null!;
    
    [JsonPropertyName("amount_due")]
    public int AmountDue { get; set; }
    
    [JsonPropertyName("amount_paid")]
    public int AmountPaid { get; set; }
    
    [JsonPropertyName("amount_remaining")]
    public int AmountRemaining { get; set; }
    
    [JsonPropertyName("attempt_count")]
    public int AttemptCount { get; set; }
    
    [JsonPropertyName("customer")]
    public string CustomerId { get; set; } = null!;
    
    [JsonPropertyName("description")]
    public string Description { get; set; } = null!;
    
    [JsonPropertyName("metadata")]
    public InvoiceMetadata InvoiceMetadata { get; set; } = null!;
    
    [JsonPropertyName("paid")]
    public bool Paid { get; set; }
    
    [JsonPropertyName("number")]
    public string InvoiceNumber { get; set; } = null!;
    
    [JsonPropertyName("created")]
    public long CreatedDate { get; set; }
    
    [JsonPropertyName("status")]
    public string Status { get; set; } = null!;
}

public class InvoiceMetadata
{
    [JsonPropertyName("paymentId")]
    public string PaymentId { get; set; } = null!;
    
    [JsonPropertyName("environment")]
    public string Environment { get; set; } = null!;
    
    [JsonPropertyName("application")]
    public string Application { get; set; } = null!;
}