namespace HSEPortal.API.Model;

public record OTPValidationModel(string OTPToken, string EmailAddress) : IValidatableModel
{
    public ValidationSummary Validate()
    {
        var hasErrors = string.IsNullOrEmpty(OTPToken) || string.IsNullOrEmpty(EmailAddress);
        return new ValidationSummary(!hasErrors, Array.Empty<string>());
    }
}