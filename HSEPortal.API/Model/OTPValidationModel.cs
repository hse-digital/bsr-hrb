namespace HSEPortal.API.Model;

public record OTPValidationModel(string OTPToken) : IValidatableModel
{
    public ValidationSummary Validate()
    {
        return new ValidationSummary(!string.IsNullOrEmpty(OTPToken), Array.Empty<string>());
    }
}