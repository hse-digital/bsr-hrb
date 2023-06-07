using System.Net.Mail;
using System.Text.RegularExpressions;

namespace HSEPortal.API.Model;

public record EmailVerificationModel(string EmailAddress) : IValidatableModel
{
    public ValidationSummary Validate()
    {
        var errors = new List<string>();
        if (string.IsNullOrEmpty(EmailAddress) || System.Net.Mail.MailAddress.TryCreate(EmailAddress, out _))
        {
            errors.Add("You must enter an email address in the correct format, like name@example.com");
        }

        return new ValidationSummary(!errors.Any(), errors.ToArray());
    }
}