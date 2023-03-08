namespace HSEPortal.API.Model.Payment.Request;

public class PaymentRequestModel : IValidatableModel
{
    public string Reference { get; set; }
    public string ReturnUrl { get; set; }
    public string Email { get; set; }
    public CardHolderDetails CardHolderDetails { get; set; }

    public ValidationSummary Validate()
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(Reference))
        {
            errors.Add("reference");
        }

        return new ValidationSummary(!errors.Any(), errors.ToArray());
    }
}

public class CardHolderDetails
{
    public string Name { get; set; }
    public CardHolderAddress Address { get; set; }
}

public class CardHolderAddress
{
    public string Line1 { get; set; }
    public string Line2 { get; set; }
    public string Postcode { get; set; }
    public string City { get; set; }
}