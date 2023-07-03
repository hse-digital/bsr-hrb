using System.Net;
using FluentAssertions;
using Xunit;

namespace HSEPortal.API.UnitTests.EmailVerification;

public class WhenValidatingToken : UnitTestBase
{
    [Fact]
    public async Task ShouldValidateTokenUsingCommonApi()
    {
        _ = await OtpService.ValidateToken("123123", "dsantin@codec.ie");
        
        HttpTest.ShouldHaveCalled($"{IntegrationOptions.CommonAPIEndpoint}/api/ValidateToken")
            .WithHeader("x-functions-key", IntegrationOptions.CommonAPIKey)
            .WithRequestJson(new
            {
                Token = "123123",
                TokenData = "dsantin@codec.ie"
            });
    }
    
    [Theory]
    [InlineData(HttpStatusCode.OK, true)]
    [InlineData(HttpStatusCode.BadRequest, false)]
    public async Task ShouldReturnBasedOnCommonApiResponse(HttpStatusCode statusCode, bool isValid)
    {
        HttpTest.RespondWith(string.Empty, (int)statusCode);
            
        var response = await OtpService.ValidateToken("123123", "dsantin@codec.ie");
        response.Should().Be(isValid);
    }
}