// using System.Net;
// using FluentAssertions;
// using Flurl;
// using Flurl.Http;
// using HSEPortal.API.Functions;
// using HSEPortal.API.Model;
// using HSEPortal.API.Services;
// using Microsoft.Extensions.Options;
// using Xunit;
//
// namespace HSEPortal.API.IntegrationTests;
//
// public class WhenGettingApplication : IntegrationTestBase
// {
//     private readonly IOptions<SwaOptions> swaOptions;
//     private readonly OTPService otpService;
//     private const string validApplicationId = "HBR170597960";
//     private const string validEmailAddress = "dont@delete.com";
//
//     public WhenGettingApplication(IOptions<SwaOptions> swaOptions, OTPService otpService)
//     {
//         this.swaOptions = swaOptions;
//         this.otpService = otpService;
//     }
//
//     [Fact]
//     public async Task ShouldReturnApplicationFromCosmos()
//     {
//         var token = await otpService.GenerateToken(validEmailAddress);
//         var response = await swaOptions.Value.Url.AppendPathSegments("api", "GetApplication")
//             .PostJsonAsync(new GetApplicationRequest { ApplicationNumber = validApplicationId, EmailAddress = validEmailAddress, OtpToken = token })
//             .ReceiveJson<BuildingApplicationModel>();
//
//         response.Id.Should().Be(validApplicationId);
//     }
//
//     [Theory]
//     [InlineData("DOESNT_EXIST", validEmailAddress)]
//     [InlineData(validApplicationId, "DOESNT_EXIST")]
//     public async Task ShouldReturnBadRequestIfApplicationIdIsInvalid(string applicationId, string emailAddress)
//     {
//         var token = await otpService.GenerateToken(emailAddress);
//         var response = await swaOptions.Value.Url.AppendPathSegments("api", "GetApplication")
//             .AllowAnyHttpStatus()
//             .PostJsonAsync(new GetApplicationRequest { ApplicationNumber = applicationId, EmailAddress = emailAddress, OtpToken = token });
//
//         response.StatusCode.Should().Be((int)HttpStatusCode.BadRequest);
//     }
//
//     [Fact]
//     public async Task ShouldReturnBadRequestIfTokenIsInvalid()
//     {
//         var response = await swaOptions.Value.Url.AppendPathSegments("api", "GetApplication")
//             .AllowAnyHttpStatus()
//             .PostJsonAsync(new GetApplicationRequest { ApplicationNumber = validApplicationId, EmailAddress = validEmailAddress, OtpToken = "INVALID_TOKEN" });
//
//         response.StatusCode.Should().Be((int)HttpStatusCode.BadRequest);
//     }
//
//     [Fact]
//     public async Task ShouldReturnApplicationWhenSendingDifferentCasingOnEmail()
//     {
//         var token = await otpService.GenerateToken(validEmailAddress);
//         var response = await swaOptions.Value.Url.AppendPathSegments("api", "GetApplication")
//             .AllowAnyHttpStatus()
//             .PostJsonAsync(new GetApplicationRequest { ApplicationNumber = validApplicationId, EmailAddress = validEmailAddress.ToUpper(), OtpToken = token })
//             .ReceiveJson<BuildingApplicationModel>();
//
//         response.Id.Should().Be(validApplicationId);
//     }
// }