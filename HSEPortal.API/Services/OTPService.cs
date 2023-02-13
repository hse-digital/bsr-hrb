using System.Text;
using OtpNet;

namespace HSEPortal.API.Services;

public class OTPService
{
    public virtual string GenerateToken()
    {
        // var secretKey = "secretKey"u8.ToArray();
        // var totp = new Totp(secretKey, step: 60 * 60);
        // return totp.ComputeTotp();

        return string.Empty;
    }
}