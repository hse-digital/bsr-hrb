using System.Text.RegularExpressions;

namespace HSEPortal.API.Model;

public record EmailVerificationModel(string EmailAddress) : IValidatableModel
{
    public ValidationSummary Validate()
    {
        var errors = new List<string>();
        if (string.IsNullOrEmpty(EmailAddress) || !Regex.IsMatch(EmailAddress, @"^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$"))
        {
            errors.Add("You must enter an email address in the correct format, like name@example.com");
        }

        return new ValidationSummary(!errors.Any(), errors.ToArray());
    }
}