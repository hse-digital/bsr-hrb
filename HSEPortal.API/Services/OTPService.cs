using OtpNet;

namespace HSEPortal.API.Services;

public class OTPService
{
    public virtual string GenerateToken(DateTime? baseDateTime = null)
    {
        var secretKey = "secretKey"u8.ToArray();
        var totp = new Totp(secretKey, step: 60 * 60);
        return totp.ComputeTotp(baseDateTime ?? DateTime.UtcNow);
    }

    public virtual bool ValidateToken(string otpToken)
    {
        var totp = new Totp("secretKey"u8.ToArray(), step: 60 * 60);
        return totp.VerifyTotp(otpToken, out _);
    } 
}