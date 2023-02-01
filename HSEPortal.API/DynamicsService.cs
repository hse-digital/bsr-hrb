using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Flurl;
using Flurl.Http;
using Flurl.Util;
using HSEPortal.API.Model;
using HSEPortal.Domain.DynamicsDefinitions;
using HSEPortal.Domain.Entities;
using Microsoft.Extensions.Options;

namespace HSEPortal.API;

public class DynamicsService
{
    private readonly DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory;
    private readonly DynamicsOptions dynamicsOptions;

    public DynamicsService(DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory, IOptions<DynamicsOptions> dynamicsOptions)
    {
        this.dynamicsModelDefinitionFactory = dynamicsModelDefinitionFactory;
        this.dynamicsOptions = dynamicsOptions.Value;
    }

    public async Task SaveRecord<TEntity, TDynamicsEntity>(TEntity record) where TEntity : Entity
        where TDynamicsEntity : DynamicsEntity<TEntity>
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<TEntity, TDynamicsEntity>();
        var dynamicsEntity = modelDefinition.BuildDynamicsEntity(record);
        await dynamicsOptions.EnvironmentUrl.AppendPathSegment(modelDefinition.Endpoint).PostJsonAsync(dynamicsEntity);
    }

    public async Task RegisterNewBuildingApplication(BuildingApplicationModel buildingApplicationModel)
    {
        var authenticationToken = await GetAuthenticationToken();
        var buildingApplication = await CreateBuildingApplication(buildingApplicationModel, authenticationToken);
        var building = await CreateBuilding(buildingApplicationModel, buildingApplication, authenticationToken);
        await CreateContact(buildingApplicationModel, building, authenticationToken);
    }

    private async Task<BuildingApplication> CreateBuildingApplication(BuildingApplicationModel model, string authenticationToken)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<BuildingApplication, DynamicsBuildingApplication>();
        var buildingApplication = new BuildingApplication(model.BuildingName);
        var dynamicsBuildingApplication = modelDefinition.BuildDynamicsEntity(buildingApplication);

        var response = await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", modelDefinition.Endpoint)
            .WithOAuthBearerToken(authenticationToken)
            .PostJsonAsync(dynamicsBuildingApplication);

        var buildingApplicationId = ExtractEntityIdFromHeader(response.Headers);
        return buildingApplication with { Id = buildingApplicationId };
    }

    private async Task<Building> CreateBuilding(BuildingApplicationModel model, BuildingApplication buildingApplication, string authenticationToken)
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

    private async Task CreateContact(BuildingApplicationModel model, Building building, string authenticationToken)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Contact, DynamicsContact>();
        var contact = new Contact(model.ContactFirstName, model.ContactLastName, model.ContactPhoneNumber, model.ContactEmailAddress, BuildingId: building.Id);
        var dynamicsContact = modelDefinition.BuildDynamicsEntity(contact);

        await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", modelDefinition.Endpoint)
            .WithOAuthBearerToken(authenticationToken)
            .PostJsonAsync(dynamicsContact);
    }

    private async Task<string> GetAuthenticationToken()
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
}