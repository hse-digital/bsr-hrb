namespace HSEPortal.API.Model;

public interface IValidatableModel
{
    ValidationSummary Validate();
}

public record ValidationSummary(bool IsValid, string[] Errors);