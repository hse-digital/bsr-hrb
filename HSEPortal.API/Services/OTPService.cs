using System.Text;
using OtpNet;

namespace HSEPortal.API.Services;

public class OTPService
{
    public virtual string GenerateToken(string secretKey, DateTime? baseDateTime = null)
    {
        var totp = new Totp(Encoding.UTF8.GetBytes(secretKey), step: 60 * 60);
        return totp.ComputeTotp(baseDateTime ?? DateTime.UtcNow);
    }

    public virtual bool ValidateToken(string otpToken, string secretKey)
    {
        var totp = new Totp(Encoding.UTF8.GetBytes(secretKey), step: 60 * 60);
        return totp.VerifyTotp(otpToken, out _);
    } 
}