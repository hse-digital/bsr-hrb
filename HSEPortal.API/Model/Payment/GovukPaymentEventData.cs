using System.Text.Json.Serialization;

namespace HSEPortal.API.Model.Payment;

public class GovukPaymentEventData
{
    [JsonPropertyName("webhook_message_id")]
    public string MessageId { get; set; }

    [JsonPropertyName("event_type")] public string EventType { get; set; }

    [JsonPropertyName("resource")] public GovukEventData EventData { get; set; }
}

public class GovukEventData
{
    [JsonPropertyName("email")] public string Email { get; set; }

    [JsonPropertyName("state")] public GovukEventState State { get; set; }

    [JsonPropertyName("amount")] public int Amount { get; set; }

    [JsonPropertyName("reference")] public string Reference { get; set; }

    [JsonPropertyName("payment_id")] public string PaymentId { get; set; }
    [JsonPropertyName("metadata")] public Dictionary<string, object> Metadata { get; set; }

    [JsonPropertyName("card_details")] public GovukCardDetails CardDetails { get; set; }
    [JsonPropertyName("created_date")] public string CreatedDate { get; set; }
}

public class GovukCardDetails
{
    [JsonPropertyName("card_type")] public string CardType { get; set; }
    [JsonPropertyName("card_brand")] public string CardBrand { get; set; }
    [JsonPropertyName("expiry_date")] public string ExpiryDate { get; set; }
    [JsonPropertyName("billing_address")] public GovukCardBillingAddress BillingAddress { get; set; }
    [JsonPropertyName("cardholder_name")] public string CardholderName { get; set; }
    [JsonPropertyName("last_digits_card_number")] public string LastDigits { get; set; }
    [JsonPropertyName("first_digits_card_number")] public string FirstDigits { get; set; }
}

public class GovukCardBillingAddress
{
    [JsonPropertyName("city")] public string City { get; set; }
    [JsonPropertyName("line1")] public string Line1 { get; set; }
    [JsonPropertyName("line2")] public string Line2 { get; set; }
    [JsonPropertyName("country")] public string Country { get; set; }
    [JsonPropertyName("postcode")] public string Postcode { get; set; }
}

public class GovukEventState
{
    [JsonPropertyName("status")] public string Status { get; set; }

    [JsonPropertyName("finished")] public bool Finished { get; set; }
}