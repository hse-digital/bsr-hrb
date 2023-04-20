using System.Text.RegularExpressions;

namespace HSEPortal.API.Services;

public class PaymentReferenceService : IPaymentReferenceService
{
    public string Generate()
    {
        return Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray())[..22], @"\W", "0");
    }
}

public interface IPaymentReferenceService
{
    string Generate();
}