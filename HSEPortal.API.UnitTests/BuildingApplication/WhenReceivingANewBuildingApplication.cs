using System.Net;
using FluentAssertions;
using HSEPortal.API.Extensions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.Domain.Entities;
using Moq;
using Xunit;

namespace HSEPortal.API.UnitTests.BuildingApplication;

public class WhenReceivingANewBuildingApplication : UnitTestBase
{
    private readonly BuildingApplicationFunctions buildingApplicationFunctions;
    private const string DynamicsAuthToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkd";
    private const string BuildingApplicationReturnId = "EC6B32C8-0188-4CCE-B58C-D6F05FEEF79B";
    private const string BuildingReturnId = "06F8C7E4-F41A-4EB4-B8E2-3501701A4A53";
    private const string BuildingApplicationId = "HBR123123123";

    public WhenReceivingANewBuildingApplication()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService, OtpService, FeatureOptions);
        HttpTest.RespondWithJson(new DynamicsAuthenticationModel { AccessToken = DynamicsAuthToken });
        HttpTest.RespondWith(status: 204, headers: BuildODataEntityHeader(BuildingApplicationReturnId));
        HttpTest.RespondWith(status: 204, headers: BuildODataEntityHeader(BuildingReturnId));
    }

    [Fact]
    public async Task ShouldAcquireAuthenticationTokenForDynamics()
    {
        var buildingRegistrationModel = GivenABuildingApplicationModel();
        await WhenANewBuildingApplicationIsReceived(buildingRegistrationModel);

        HttpTest.ShouldHaveCalled($"https://login.microsoftonline.com/{DynamicsOptions.TenantId}/oauth2/token")
            .WithRequestUrlEncoded(new
            {
                grant_type = "client_credentials",
                client_id = DynamicsOptions.ClientId,
                client_secret = DynamicsOptions.ClientSecret,
                resource = DynamicsOptions.EnvironmentUrl
            });
    }

    [Theory]
    [InlineData(null, "firstname", "lastname", "phone", "email")]
    [InlineData("building", null, "lastname", "phone", "email")]
    [InlineData("building", "firstname", null, "phone", "email")]
    [InlineData("building", "firstname", "lastname", null, "email")]
    [InlineData("building", "firstname", "lastname", "phone", null)]
    public async Task ShouldReturnBadRequestIfInputsAreInvalid(string buildingName, string contactFirstName, string contactLastName, string contactPhone, string contactEmail)
    {
        var buildingRegistrationModel = new BuildingApplicationModel(buildingName, contactFirstName, contactLastName, contactPhone, contactEmail);
        var response = await WhenANewBuildingApplicationIsReceived(buildingRegistrationModel);

        response.HttpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task ShouldCreateBuildingApplication()
    {
        var buildingRegistrationModel = GivenABuildingApplicationModel();
        await WhenANewBuildingApplicationIsReceived(buildingRegistrationModel);

        var request = HttpTest.CallLog.FirstOrDefault(x => x.Request.Url == $"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_buildingapplications");
        request.Should().NotBeNull();
        request!.Request.Headers.Should().Contain(("Authorization", $"Bearer {DynamicsAuthToken}"));
        request.RequestBody.Should().MatchRegex($"{{\"bsr_name\":\"{buildingRegistrationModel.BuildingName}\",\"bsr_applicationid\":\"HBR\\d{{9}}\"}}");
    }

    [Fact]
    public async Task ShouldCreateBuilding()
    {
        var buildingRegistrationModel = GivenABuildingApplicationModel();
        await WhenANewBuildingApplicationIsReceived(buildingRegistrationModel);

        HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_buildings")
            .WithOAuthBearerToken(DynamicsAuthToken)
            .WithRequestJson(new DynamicsBuilding(buildingRegistrationModel.BuildingName, odataReferenceId: $"/bsr_buildingapplications({BuildingApplicationReturnId})"));
    }

    [Fact]
    public async Task ShouldCreateContact()
    {
        var buildingRegistrationModel = GivenABuildingApplicationModel();
        await WhenANewBuildingApplicationIsReceived(buildingRegistrationModel);

        HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/contacts")
            .WithOAuthBearerToken(DynamicsAuthToken)
            .WithRequestJson(new DynamicsContact(buildingRegistrationModel.ContactFirstName, buildingRegistrationModel.ContactLastName, buildingRegistrationModel.ContactPhoneNumber, buildingRegistrationModel.ContactEmailAddress, odataReferenceId: $"/bsr_buildings({BuildingReturnId})"));
    }

    [Fact]
    public async Task ShouldSetIdToARandom9DigitNumberStartingWithHBR()
    {
        var buildingApplicationModel = GivenABuildingApplicationModel();
        var response = await WhenANewBuildingApplicationIsReceived(buildingApplicationModel);

        var application = await response.HttpResponse.ReadAsJsonAsync<BuildingApplicationModel>();
        application.Id.Should().MatchRegex(@"HBR\d{9}");
    }

    private BuildingApplicationModel GivenABuildingApplicationModel()
    {
        return new BuildingApplicationModel("Id", "BuildingName", "Diego", "Santin", "+44 808 157 0192", "dsantin@codec.ie");
    }

    private async Task<CustomHttpResponseData> WhenANewBuildingApplicationIsReceived(BuildingApplicationModel buildingApplicationModel)
    {
        var requestData = BuildHttpRequestData(buildingApplicationModel);
        return await buildingApplicationFunctions.NewBuildingApplication(requestData);
    }
}