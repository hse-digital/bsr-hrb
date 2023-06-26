using FluentAssertions;
using HSEPortal.API.Services;
using Xunit;

namespace HSEPortal.API.UnitTests.EmailVerification;

public class WhenGeneratingOTP : UnitTestBase
{
    [Fact]
    public void ShouldNormalizeSecretToLowerCase()
    {
        var secrets = new[]
        {
            "dsantin@codec.ie",
            "DSANTIN@codec.IE",
            "dSaNtIn@CoDeC.Ie"
        };
        
        var service = new OTPService();

        var tokens = secrets.Select(x => service.GenerateToken(x)).Distinct();
        tokens.Count().Should().Be(1);
    }
    
}