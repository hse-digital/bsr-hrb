using FluentAssertions;
using Flurl;
using Flurl.Http;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using HSEPortal.TestingCommon.Builders;
using Microsoft.Extensions.Options;
using Xunit;

namespace HSEPortal.API.IntegrationTests;

public class WhenRequestingANewBuildingRegistration : IntegrationTestBase, IDisposable
{
    private readonly IOptions<DynamicsOptions> dynamicsOptions;
    private readonly IOptions<SwaOptions> swaOptions;
    private readonly DynamicsService dynamicsService;

    public WhenRequestingANewBuildingRegistration(IOptions<DynamicsOptions> dynamicsOptions, IOptions<SwaOptions> swaOptions, DynamicsService dynamicsService)
    {
        this.dynamicsOptions = dynamicsOptions;
        this.swaOptions = swaOptions;
        this.dynamicsService = dynamicsService;
    }

    [Fact]
    public async Task ShouldCreateRelatedEntitiesInDynamics()
    {
        var buildingRegistrationModel = GivenABuildingRegistrationModel();
        await GivenAnAuthenticationToken();
        await WhenSendingTheRequestForANewBuildingRegistration(buildingRegistrationModel);

        await ThenShouldCreateBuildingApplicationRecord(buildingRegistrationModel);
        await ThenShouldCreateBuildingRecord(buildingRegistrationModel);
        await ThenShouldCreateContactRecord(buildingRegistrationModel);
    }

    private static BuildingRegistrationModel GivenABuildingRegistrationModel()
    {
        return new BuildingRegistrationModelBuilder().Build();
    }

    private string token = null!;

    private async Task GivenAnAuthenticationToken()
    {
        token = await dynamicsService.GetAuthenticationTokenAsync();
    }

    private async Task WhenSendingTheRequestForANewBuildingRegistration(BuildingRegistrationModel buildingRegistrationModel)
    {
        await swaOptions.Value.Url.AppendPathSegments("api", nameof(BuildingApplicationFunctions.NewBuildingApplication))
            .PostJsonAsync(buildingRegistrationModel);
    }

    private DynamicsBuildingApplication newBuildingApplication = null!;

    private async Task ThenShouldCreateBuildingApplicationRecord(BuildingRegistrationModel buildingRegistrationModel)
    {
        var buildApplications = await dynamicsOptions.Value.EnvironmentUrl.AppendPathSegments("api", "data", "v9.2", "bsr_buildingapplications")
            .SetQueryParam("$filter", $"bsr_name eq '{buildingRegistrationModel.BuildingName}'")
            .WithOAuthBearerToken(token)
            .GetJsonAsync<DynamicsResponse<DynamicsBuildingApplication>>();

        newBuildingApplication = buildApplications.Value.Single();
        newBuildingApplication.bsr_name.Should().Be(buildingRegistrationModel.BuildingName);
    }

    private DynamicsBuilding newBuilding = null!;

    private async Task ThenShouldCreateBuildingRecord(BuildingRegistrationModel buildingRegistrationModel)
    {
        var buildings = await dynamicsOptions.Value.EnvironmentUrl.AppendPathSegments("api", "data", "v9.2", "bsr_buildings")
            .SetQueryParam("$filter", $"bsr_name eq '{buildingRegistrationModel.BuildingName}'")
            .WithOAuthBearerToken(token)
            .GetJsonAsync<DynamicsResponse<DynamicsBuilding>>();

        newBuilding = buildings.Value.Single();
        newBuilding.bsr_name.Should().Be(buildingRegistrationModel.BuildingName);
    }

    private DynamicsContact newContact = null!;

    private async Task ThenShouldCreateContactRecord(BuildingRegistrationModel buildingRegistrationModel)
    {
        var contacts = await dynamicsOptions.Value.EnvironmentUrl.AppendPathSegments("api", "data", "v9.2", "contacts")
            .SetQueryParam("$filter", $"firstname eq '{buildingRegistrationModel.ContactFirstName}' and lastname eq '{buildingRegistrationModel.ContactLastName}' and telephone1 eq '{buildingRegistrationModel.ContactPhoneNumber}' and emailaddress1 eq '{buildingRegistrationModel.ContactEmailAddress}'")
            .WithOAuthBearerToken(token)
            .GetJsonAsync<DynamicsResponse<DynamicsContact>>();

        newContact = contacts.Value.Single();
        newContact.firstname.Should().Be(buildingRegistrationModel.ContactFirstName);
        newContact.lastname.Should().Be(buildingRegistrationModel.ContactLastName);
        newContact.telephone1.Should().Be(buildingRegistrationModel.ContactPhoneNumber);
        newContact.emailaddress1.Should().Be(buildingRegistrationModel.ContactEmailAddress);
    }

    public void Dispose()
    {
        dynamicsOptions.Value.EnvironmentUrl.AppendPathSegments("api", "data", "v9.2", $"bsr_buildingapplications({newBuildingApplication.bsr_buildingapplicationid})").WithOAuthBearerToken(token).DeleteAsync().GetAwaiter().GetResult();
        dynamicsOptions.Value.EnvironmentUrl.AppendPathSegments("api", "data", "v9.2", $"bsr_buildings({newBuilding.bsr_buildingid})").WithOAuthBearerToken(token).DeleteAsync().GetAwaiter().GetResult();
        dynamicsOptions.Value.EnvironmentUrl.AppendPathSegments("api", "data", "v9.2", $"contacts({newContact.contactid})").WithOAuthBearerToken(token).DeleteAsync().GetAwaiter().GetResult();
    }
}