using System.Text.RegularExpressions;
using Flurl;
using Flurl.Http;
using Flurl.Util;
using HSEPortal.API.Model;
using HSEPortal.API.Model.DynamicsSynchronisation;
using HSEPortal.API.Model.LocalAuthority;
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

        var applicationId = $"HRB{GenerateApplicationId()}";
        var building = await CreateBuildingAsync(buildingApplicationModel, authenticationToken);
        var contact = await CreateContactAsync(buildingApplicationModel, authenticationToken);
        await CreateBuildingApplicationAsync(buildingApplicationModel, applicationId, contact, building, authenticationToken);

        return buildingApplicationModel with { Id = applicationId };
    }

    public async Task SendVerificationEmail(EmailVerificationModel emailVerificationModel, string otpToken)
    {
        await dynamicsOptions.EmailVerificationFlowUrl.PostJsonAsync(new
        {
            emailAddress = emailVerificationModel.EmailAddress,
            otp = otpToken
        });
    }

    public async Task<LocalAuthoritiesSearchResponse> SearchLocalAuthorities(string authorityName)
    {
        var authenticationToken = await GetAuthenticationTokenAsync();

        return await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", "accounts")
            .SetQueryParam("$filter", $"_bsr_accounttype_accountid_value eq '{dynamicsOptions.LocalAuthorityTypeId}' and contains(name, '{authorityName}')")
            .SetQueryParam("$select", "name")
            .WithOAuthBearerToken(authenticationToken)
            .GetJsonAsync<LocalAuthoritiesSearchResponse>();
    }

    public async Task<DynamicsBuildingApplication> GetBuildingApplicationUsingId(string applicationId)
    {
        var authenticationToken = await GetAuthenticationTokenAsync();

        var response = await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", "bsr_buildingapplications")
            .SetQueryParam("$filter", $"bsr_applicationreturncode eq '{applicationId}'")
            .SetQueryParam("$expand", "bsr_Building")
            .WithOAuthBearerToken(authenticationToken)
            .GetJsonAsync<DynamicsResponse<DynamicsBuildingApplication>>();

        return response.value.FirstOrDefault();
    }

    public async Task UpdateBuildingApplication(BuildingApplicationModel model, DynamicsBuildingApplication dynamicsBuildingApplication, BuildingApplicationStage stage)
    {
        var authenticationToken = await GetAuthenticationTokenAsync();

        await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", $"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})")
            .WithOAuthBearerToken(authenticationToken)
            .PatchJsonAsync(new DynamicsBuildingApplication(dynamicsBuildingApplication.bsr_applicationreturncode, bsr_applicationstage: stage));
    }

    public async Task CreateBuildingStructures(Structures structures)
    {
        var authenticationToken = await GetAuthenticationTokenAsync();

        var structureDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Structure, DynamicsStructure>();
        foreach (var section in structures.BuildingStructures)
        {
            var dynamicsStructure = BuildDynamicsStructure(structures, section, structureDefinition);
            dynamicsStructure = await SetYearOfCompletion(section, authenticationToken, dynamicsStructure);
            dynamicsStructure = await CreateStructure(structureDefinition, authenticationToken, dynamicsStructure);
            await CreateStructureOptionalAddresses(section, dynamicsStructure, authenticationToken);
        }
    }

    private async Task CreateStructureOptionalAddresses(SectionModel section, DynamicsStructure dynamicsStructure, string authenticationToken)
    {
        foreach (var address in section.Addresses.Skip(1))
        {
            var dynamicsAddress = new DynamicsAddress
            {
                bsr_line1 = string.Join(", ", address.Address.Split(',').Take(3)),
                bsr_line2 = address.AddressLineTwo,
                bsr_addresstypecode = AddressType.Other,
                bsr_city = address.Town,
                bsr_postcode = address.Postcode,
                bsr_uprn = address.UPRN,
                bsr_usrn = address.USRN,
                bsr_manualaddress = address.IsManual ? YesNoOption.Yes : YesNoOption.No,
                structureReferenceId = $"/bsr_blocks({dynamicsStructure.bsr_blockid})"
            };

            await dynamicsOptions.EnvironmentUrl
                .AppendPathSegments("api", "data", "v9.2", "bsr_addresses")
                .WithOAuthBearerToken(authenticationToken)
                .PostJsonAsync(dynamicsAddress);
        }
    }

    private async Task<DynamicsStructure> SetYearOfCompletion(SectionModel section, string authenticationToken, DynamicsStructure dynamicsStructure)
    {
        if (dynamicsStructure.bsr_doyouknowtheblocksexactconstructionyear == ConstructionYearOption.Exact)
        {
            var yearResponse = await dynamicsOptions.EnvironmentUrl
                .AppendPathSegments("api", "data", "v9.2", "bsr_years")
                .SetQueryParam("$filter", $"bsr_name eq '{section.YearOfCompletion}'")
                .WithOAuthBearerToken(authenticationToken)
                .GetJsonAsync<DynamicsResponse<DynamicsYear>>();

            return dynamicsStructure with { exactConstructionYearReferenceId = $"/bsr_years({yearResponse.value[0].bsr_yearid})" };
        }

        if (dynamicsStructure.bsr_doyouknowtheblocksexactconstructionyear == ConstructionYearOption.YearRange)
        {
            var yearRangesResponse = await dynamicsOptions.EnvironmentUrl
                .AppendPathSegments("api", "data", "v9.2", "bsr_sectioncompletionyearranges")
                .SetQueryParam("$filter", $"bsr_name eq '{section.YearOfCompletionRange.Replace("-", " ")}'")
                .WithOAuthBearerToken(authenticationToken)
                .GetJsonAsync<DynamicsResponse<DynamicsYearRange>>();

            return dynamicsStructure with { sectionCompletionYearRangeReferenceId = $"/bsr_sectioncompletionyearranges({yearRangesResponse.value[0].bsr_sectioncompletionyearrangeid})" };
        }

        return dynamicsStructure;
    }

    private static DynamicsStructure BuildDynamicsStructure(Structures structures, SectionModel section, DynamicsModelDefinition<Structure, DynamicsStructure> structureDefinition)
    {
        var structure = new Structure(section.Name ?? structures.DynamicsBuildingApplication.bsr_Building?.bsr_name, section.FloorsAbove, section.Height, section.ResidentialUnits, section.PeopleLivingInBuilding, section.YearOfCompletionOption);
        var dynamicsStructure = structureDefinition.BuildDynamicsEntity(structure);

        var primaryAddress = section.Addresses[0];
        dynamicsStructure = dynamicsStructure with
        {
            buildingReferenceId = $"/bsr_buildings({structures.DynamicsBuildingApplication._bsr_building_value})",
            buildingApplicationReferenceId = $"/bsr_buildingapplications({structures.DynamicsBuildingApplication.bsr_buildingapplicationid})",
            bsr_addressline1 = string.Join(", ", primaryAddress.Address.Split(',').Take(3)),
            bsr_addressline2 = primaryAddress.AddressLineTwo,
            bsr_addresstype = AddressType.Primary,
            bsr_city = primaryAddress.Town,
            bsr_postcode = primaryAddress.Postcode,
            bsr_uprn = primaryAddress.UPRN,
            bsr_usrn = primaryAddress.USRN,
            bsr_manualaddress = primaryAddress.IsManual ? YesNoOption.Yes : YesNoOption.No
        };

        return dynamicsStructure;
    }

    private async Task<DynamicsStructure> CreateStructure(DynamicsModelDefinition<Structure, DynamicsStructure> structureDefinition, string authenticationToken, DynamicsStructure dynamicsStructure)
    {
        var response = await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", structureDefinition.Endpoint)
            .WithOAuthBearerToken(authenticationToken)
            .PostJsonAsync(dynamicsStructure);

        var structureId = ExtractEntityIdFromHeader(response.Headers);
        return dynamicsStructure with { bsr_blockid = structureId };
    }

    private async Task<BuildingApplication> CreateBuildingApplicationAsync(BuildingApplicationModel model, string applicationId, Contact contact, Building building, string authenticationToken)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<BuildingApplication, DynamicsBuildingApplication>();
        var buildingApplication = new BuildingApplication(applicationId, contact.Id, building.Id);
        var dynamicsBuildingApplication = modelDefinition.BuildDynamicsEntity(buildingApplication);

        var response = await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", modelDefinition.Endpoint)
            .WithOAuthBearerToken(authenticationToken)
            .AllowAnyHttpStatus()
            .PostJsonAsync(dynamicsBuildingApplication);

        var buildingApplicationId = ExtractEntityIdFromHeader(response.Headers);
        return buildingApplication with { Id = buildingApplicationId };
    }

    private async Task<Building> CreateBuildingAsync(BuildingApplicationModel model, string authenticationToken)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Building, DynamicsBuilding>();
        var building = new Building(model.BuildingName);
        var dynamicsBuilding = modelDefinition.BuildDynamicsEntity(building);

        var response = await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", modelDefinition.Endpoint)
            .WithOAuthBearerToken(authenticationToken)
            .PostJsonAsync(dynamicsBuilding);

        var buildingId = ExtractEntityIdFromHeader(response.Headers);
        return building with { Id = buildingId };
    }

    private async Task<Contact> CreateContactAsync(BuildingApplicationModel model, string authenticationToken)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Contact, DynamicsContact>();
        var contact = new Contact(model.ContactFirstName, model.ContactLastName, model.ContactPhoneNumber, model.ContactEmailAddress);
        var dynamicsContact = modelDefinition.BuildDynamicsEntity(contact);

        var response = await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", modelDefinition.Endpoint)
            .WithOAuthBearerToken(authenticationToken)
            .PostJsonAsync(dynamicsContact);

        var contactId = ExtractEntityIdFromHeader(response.Headers);
        return contact with { Id = contactId };
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

    private async Task<List<DynamicsYear>> GetYearCollection(string authToken)
    {
        var dynamicsYearsResponse = await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", "bsr_years")
            .WithOAuthBearerToken(authToken)
            .GetJsonAsync<DynamicsResponse<DynamicsYear>>();

        return dynamicsYearsResponse.value;
    }

    private async Task<List<DynamicsYearRange>> GetYearRangeCollection(string authToken)
    {
        var dynamicsYearRangesResponse = await dynamicsOptions.EnvironmentUrl
            .AppendPathSegments("api", "data", "v9.2", "bsr_sectioncompletionyearranges")
            .WithOAuthBearerToken(authToken)
            .GetJsonAsync<DynamicsResponse<DynamicsYearRange>>();

        return dynamicsYearRangesResponse.value;
    }
}