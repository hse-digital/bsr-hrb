// using System.Net;
// using FluentAssertions;
// using Flurl;
// using Flurl.Http;
// using HSEPortal.API.Services;
// using Microsoft.Extensions.Options;
// using Xunit;
//
// namespace HSEPortal.API.IntegrationTests;
//
// public class WhenValidatingApplicationNumber : IntegrationTestBase
// {
//     private readonly IOptions<SwaOptions> swaOptions;
//
//     public WhenValidatingApplicationNumber(IOptions<SwaOptions> swaOptions)
//     {
//         this.swaOptions = swaOptions;
//     }
//
//     [Theory]
//     [InlineData("dont@delete.com", "HBR170597960", HttpStatusCode.OK)]
//     [InlineData("DONT@DELETE.com", "HBR170597960", HttpStatusCode.OK)]
//     [InlineData("DOESNT-EXIST", "DOESNT-EXIST", HttpStatusCode.BadRequest)]
//     public async Task ShouldReturnApplicationExistsBasedOnNumberAndEmailAddress(string emailAddress, string applicationNumber, HttpStatusCode expectedResponse)
//     {
//         var response = await swaOptions.Value.Url.AppendPathSegments("api", "ValidateApplicationNumber")
//             .AllowAnyHttpStatus().PostJsonAsync(new
//             {
//                 ApplicationNumber = applicationNumber,
//                 EmailAddress = emailAddress 
//             });
//
//         response.StatusCode.Should().Be((int)expectedResponse);
//     }
// }