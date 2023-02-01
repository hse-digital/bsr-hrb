using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using FluentAssertions;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.Domain.Entities;
using NUnit.Framework;

namespace HSEPortal.API.UnitTests;

public class WhenCreatingABuildingApplication : UnitTestBase
{
    private BuildingApplicationFunctions buildingApplicationFunctions = null!;
    private const string dynamicsAuthToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkd";
    private const string buildingApplicationReturnId = "EC6B32C8-0188-4CCE-B58C-D6F05FEEF79B";
    private const string buildingReturnId = "06F8C7E4-F41A-4EB4-B8E2-3501701A4A53";

    protected override void AdditionalSetup()
    {
        buildingApplicationFunctions = new BuildingApplicationFunctions(DynamicsService);
        HttpTest.RespondWithJson(new DynamicsAuthenticationModel { AccessToken = dynamicsAuthToken });
        HttpTest.RespondWith(status: 204, headers: BuildODataEntityHeader(buildingApplicationReturnId));
        HttpTest.RespondWith(status: 204, headers: BuildODataEntityHeader(buildingReturnId));
    }

    [Test]
    public async Task ShouldAcquireAuthenticationTokenForDynamics()
    {
        var buildingApplicationModel = GivenABuildingApplicationModel();
        await WhenSendingANewBuildingApplication(buildingApplicationModel);

        HttpTest.ShouldHaveCalled($"https://login.microsoftonline.com/{DynamicsOptions.TenantId}/oauth2/token")
            .WithRequestUrlEncoded(new
            {
                grant_type = "client_credentials",
                client_id = DynamicsOptions.ClientId,
                client_secret = DynamicsOptions.ClientSecret,
                resource = DynamicsOptions.EnvironmentUrl
            });
    }

    [Test]
    public async Task ShouldCreateBuildingApplication()
    {
        var buildingApplicationModel = GivenABuildingApplicationModel();
        await WhenSendingANewBuildingApplication(buildingApplicationModel);

        HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_buildingapplications")
            .WithOAuthBearerToken(dynamicsAuthToken)
            .WithRequestJson(new DynamicsBuildingApplication(buildingApplicationModel.BuildingName));
    }

    [Test]
    public async Task ShouldCreateBuilding()
    {
        var buildingApplicationModel = GivenABuildingApplicationModel();
        await WhenSendingANewBuildingApplication(buildingApplicationModel);

        HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_buildings")
            .WithOAuthBearerToken(dynamicsAuthToken)
            .WithRequestJson(new DynamicsBuilding(buildingApplicationModel.BuildingName, odataReferenceId: $"/bsr_buildingapplications({buildingApplicationReturnId})"));
    }

    [Test]
    public async Task ShouldCreateContact()
    {
        var buildingApplicationModel = GivenABuildingApplicationModel();
        await WhenSendingANewBuildingApplication(buildingApplicationModel);

        HttpTest.ShouldHaveCalled($"{DynamicsOptions.EnvironmentUrl}/api/data/v9.2/contacts")
            .WithOAuthBearerToken(dynamicsAuthToken)
            .WithRequestJson(new DynamicsContact(buildingApplicationModel.ContactFirstName, buildingApplicationModel.ContactLastName, buildingApplicationModel.ContactPhoneNumber, buildingApplicationModel.ContactEmailAddress, odataReferenceId: $"/bsr_buildings({buildingReturnId})"));
    }

    private BuildingRegistrationModel GivenABuildingApplicationModel()
    {
        return new BuildingRegistrationModel
        {
            BuildingName = "BuildingName",
            ContactFirstName = "Diego",
            ContactLastName = "Santin",
            ContactPhoneNumber = "+44 808 157 0192",
            ContactEmailAddress = "dsantin@codec.ie"
        };
    }

    private async Task WhenSendingANewBuildingApplication(BuildingRegistrationModel buildingRegistrationModel)
    {
        var requestData = BuildHttpRequestData(buildingRegistrationModel);
        await buildingApplicationFunctions.NewBuildingApplication(requestData);
    }
}