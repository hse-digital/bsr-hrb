using System.Net;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker.Http;
using Xunit;

namespace HSEPortal.API.UnitTests;

public class WhenRequestingANewBuildingRegistration : UnitTestBase
{
    private readonly BuildingApplicationFunctions buildingApplicationFunctions;
    private const string dynamicsAuthToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkd";
    private const string buildingApplicationReturnId = "EC6B32C8-0188-4CCE-B58C-D6F05FEEF79B";
    private const string buildingReturnId = "06F8C7E4-F41A-4EB4-B8E2-3501701A4A53";

    public WhenRequestingANewBuildingRegistration()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService);
        HttpTest.RespondWithJson(new DynamicsAuthenticationModel { AccessToken = dynamicsAuthToken });
        HttpTest.RespondWith(status: 204, headers: BuildODataEntityHeader(buildingApplicationReturnId));
        HttpTest.RespondWith(status: 204, headers: BuildODataEntityHeader(buildingReturnId));
    }

    [Fact]
    public async Task ShouldAcquireAuthenticationTokenForDynamics()
    {
        var buildingRegistrationModel = GivenABuildingRegistrationModel();
        await WhenSendingANewBuildingRegistration(buildingRegistrationModel);

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
        var buildingRegistrationModel = new BuildingRegistrationModel(buildingName, contactFirstName, contactLastName, contactPhone, contactEmail);
        var response = await WhenSendingANewBuildingRegistration(buildingRegistrationModel);
    }

    [Fact]
    public async Task ShouldCreateBuildingApplication()
    {
        var buildingRegistrationModel = GivenABuildingRegistrationModel();
        await WhenSendingANewBuildingRegistration(buildingRegistrationModel);

        HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_buildingapplications")
            .WithOAuthBearerToken(dynamicsAuthToken)
            .WithRequestJson(new DynamicsBuildingApplication(buildingRegistrationModel.BuildingName));
    }

    [Fact]
    public async Task ShouldCreateBuilding()
    {
        var buildingRegistrationModel = GivenABuildingRegistrationModel();
        await WhenSendingANewBuildingRegistration(buildingRegistrationModel);

        HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_buildings")
            .WithOAuthBearerToken(dynamicsAuthToken)
            .WithRequestJson(new DynamicsBuilding(buildingRegistrationModel.BuildingName, odataReferenceId: $"/bsr_buildingapplications({buildingApplicationReturnId})"));
    }

    [Fact]
    public async Task ShouldCreateContact()
    {
        var buildingRegistrationModel = GivenABuildingRegistrationModel();
        await WhenSendingANewBuildingRegistration(buildingRegistrationModel);

        HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/contacts")
            .WithOAuthBearerToken(dynamicsAuthToken)
            .WithRequestJson(new DynamicsContact(buildingRegistrationModel.ContactFirstName, buildingRegistrationModel.ContactLastName, buildingRegistrationModel.ContactPhoneNumber, buildingRegistrationModel.ContactEmailAddress, odataReferenceId: $"/bsr_buildings({buildingReturnId})"));
    }

    private BuildingRegistrationModel GivenABuildingRegistrationModel()
    {
        return new BuildingRegistrationModel("BuildingName", "Diego", "Santin", "+44 808 157 0192", "dsantin@codec.ie");
    }

    private async Task<HttpResponseData> WhenSendingANewBuildingRegistration(BuildingRegistrationModel buildingRegistrationModel)
    {
        var requestData = BuildHttpRequestData(buildingRegistrationModel);
        return await buildingApplicationFunctions.NewBuildingApplication(requestData);
    }
}