// using System.Net;
// using FluentAssertions;
// using HSEPortal.API.Functions;
// using HSEPortal.API.Model;
// using HSEPortal.API.Services;
// using Microsoft.Extensions.Options;
// using Xunit;
//
// namespace HSEPortal.API.UnitTests.BuildingApplication;
//
// public class WhenValidatingApplicationNumber : UnitTestBase
// {
//     private readonly BuildingApplicationFunctions buildingApplicationFunctions;
//
//     public WhenValidatingApplicationNumber()
//     {
//         buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService, OtpService, FeatureOptions, new OptionsWrapper<IntegrationsOptions>(IntegrationOptions));
//     }
//
//     [Fact]
//     public async Task ShouldReturnOkWhenApplicationExists()
//     {
//         var applicationId = "RegistrationId";
//         var contactEmailAddress = "ContactEmailAddress";
//
//         var response = await buildingApplicationFunctions.ValidateApplicationNumber(BuildHttpRequestData(new ValidateApplicationRequest(applicationId, contactEmailAddress), applicationId, contactEmailAddress));
//         response.StatusCode.Should().Be(HttpStatusCode.OK);
//     }
//
//     [Fact]
//     public async Task ShouldReturnBadRequestIfApplicationDoesNotExist()
//     {
//         var applicationId = "RegistrationId";
//         var contactEmailAddress = "ContactEmailAddress";
//
//         var response = await buildingApplicationFunctions.ValidateApplicationNumber(BuildHttpRequestData(new object(), applicationId, contactEmailAddress));
//
//         response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
//     }
// }