using System.Text.RegularExpressions;
using Flurl;
using Flurl.Http;
using Flurl.Util;
using HSEPortal.API.Model;
using HSEPortal.Domain.DynamicsDefinitions;
using HSEPortal.Domain.Entities;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Services;

public class DynamicsService
{
    private readonly DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory;
    private readonly DynamicsOptions dynamicsOptions;

    public DynamicsService(DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory, IOptions<DynamicsOptions> dynamicsOptions)
    {
        this.dynamicsModelDefinitionFactory = dynamicsModelDefinitionFactory;
        this.dynamicsOptions = dynamicsOptions.Value;
    }

    public async Task<BuildingApplicationModel> RegisterNewBuildingApplicationAsync(BuildingApplicationModel buildingApplicationModel)
    {
        var authenticationToken = await GetAuthenticationTokenAsync();

        var applicationId = $"HBR{GenerateApplicationId()}";
        var buildingApplication = await CreateBuildingApplicationAsync(buildingApplicationModel, applicationId, authenticationToken);
        var building = await CreateBuildingAsync(buildingApplicationModel, buildingApplication, authenticationToken);
        await CreateContactAsync(buildingApplicationModel, building, authenticationToken);

        return buildingApplicationModel with { Id = applicationId };
    }

    public async Task SendVerificationEmail(EmailVerificationModel emailVerificationModel, string otpToken)
    {
        await dynamicsOptions.EmailVerificationFlowUrl
            .PostJsonAsync(new
            {
                emailAddress = emailVerificationModel.EmailAddress,
                otp = otpToken
            });
    }

    private async Task<BuildingApplication> CreateBuildingApplicationAsync(BuildingApplicationModel model, string applicationId, string authenticationToken)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<BuildingApplication, DynamicsBuildingApplication>();
        var buildingApplication = new BuildingApplication(model.BuildingName, applicationId);
        var dynamicsBuildingApplication = modelDefinition.BuildDynamicsEntity(buildingApplication);

        var response = await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", modelDefinition.Endpoint)
            .WithOAuthBearerToken(authenticationToken)
            .PostJsonAsync(dynamicsBuildingApplication);

        var buildingApplicationId = ExtractEntityIdFromHeader(response.Headers);
        return buildingApplication with { Id = buildingApplicationId };
    }

    private async Task<Building> CreateBuildingAsync(BuildingApplicationModel model, BuildingApplication buildingApplication, string authenticationToken)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Building, DynamicsBuilding>();
        var building = new Building(model.BuildingName, BuildingApplicationId: buildingApplication.Id);
        var dynamicsBuilding = modelDefinition.BuildDynamicsEntity(building);

        var response = await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", modelDefinition.Endpoint)
            .WithOAuthBearerToken(authenticationToken)
            .PostJsonAsync(dynamicsBuilding);

        var buildingId = ExtractEntityIdFromHeader(response.Headers);
        return building with { Id = buildingId };
    }

    private async Task CreateContactAsync(BuildingApplicationModel model, Building building, string authenticationToken)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Contact, DynamicsContact>();
        var contact = new Contact(model.ContactFirstName, model.ContactLastName, model.ContactPhoneNumber, model.ContactEmailAddress, BuildingId: building.Id);
        var dynamicsContact = modelDefinition.BuildDynamicsEntity(contact);

        await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", modelDefinition.Endpoint)
            .WithOAuthBearerToken(authenticationToken)
            .PostJsonAsync(dynamicsContact);
    }

    internal async Task<string> GetAuthenticationTokenAsync()
    {
        var response = await $"https://login.microsoftonline.com/{dynamicsOptions.TenantId}/oauth2/token"
            .PostUrlEncodedAsync(new
            {
                grant_type = "client_credentials",
                client_id = dynamicsOptions.ClientId,
                client_secret = dynamicsOptions.ClientSecret,
                resource = dynamicsOptions.EnvironmentUrl
            })
            .ReceiveJson<DynamicsAuthenticationModel>();

        return response.AccessToken;
    }

    private string ExtractEntityIdFromHeader(IReadOnlyNameValueList<string> headers)
    {
        var header = headers.FirstOrDefault(x => x.Name == "OData-EntityId");
        var id = Regex.Match(header.Value, @"\((.+)\)");

        return id.Groups[1].Value;
    }

    private static string GenerateApplicationId()
    {
        var uniqueCode = $"{DateTime.Now.Ticks / 10 % 1000000000:d9}";
        return uniqueCode.PadLeft(9, '0');
    }
}