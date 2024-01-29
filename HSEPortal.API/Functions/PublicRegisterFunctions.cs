using System.Net;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Functions;

public class PublicRegisterFunctions
{
    private readonly DynamicsApi dynamicsApi;
    private readonly FeatureOptions featureOptions;
    private readonly PublicRegisterOptions publicRegisterOptions;

    public PublicRegisterFunctions(IOptions<FeatureOptions> featureOptions, IOptions<PublicRegisterOptions> publicRegisterOptions, DynamicsApi dynamicsApi)
    {
        this.dynamicsApi = dynamicsApi;
        this.featureOptions = featureOptions.Value;
        this.publicRegisterOptions = publicRegisterOptions.Value;
    }

    [Function(nameof(IsPublicRegisterProtectionEnabled))]
    public Task<HttpResponseData> IsPublicRegisterProtectionEnabled([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request)
    {
        return request.CreateObjectResponseAsync(featureOptions.EnablePublicRegisterPasswordProtection);
    }

    [Function(nameof(ValidatePublicRegisterPassword))]
    public HttpResponseData ValidatePublicRegisterPassword([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request)
    {
        request.Headers.TryGetValues("PublicRegisterPassword", out var headerValues);
        var password = headerValues?.FirstOrDefault();

        return request.CreateResponse(password == publicRegisterOptions.Password ? HttpStatusCode.OK : HttpStatusCode.BadRequest);
    }

    [Function(nameof(SearchPublicRegister))]
    public async Task<HttpResponseData> SearchPublicRegister([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT c.id, c.ContactFirstName, c.ContactLastName, c.ApplicationStatus, c.BuildingName, c.Versions FROM c JOIN v in c.Versions JOIN s IN v.Sections JOIN a IN s.Addresses WHERE a.Postcode = {postcode} OR a.PostcodeEntered = {postcode}", Connection = "CosmosConnection")]
        List<BuildingApplicationModel> buildingApplications,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT c.id, c.ContactFirstName, c.ContactLastName, c.ApplicationStatus, c.BuildingName, c.Sections, c.AccountablePersons as AccountablePersons FROM c JOIN s IN c.Sections JOIN a IN s.Addresses WHERE a.Postcode = {postcode} OR a.PostcodeEntered = {postcode}",
            Connection = "CosmosConnection")]
        List<PublicRegisterApplicationModel> nonVersionedApplications)
    {
        if (featureOptions.EnablePublicRegisterPasswordProtection && (!request.Headers.TryGetValues("PublicRegisterPassword", out var headerValues) || headerValues.FirstOrDefault() != publicRegisterOptions.Password))
        {
            return request.CreateResponse(HttpStatusCode.BadRequest);
        }

        var versionedApplications = await GetAcceptedVersionFromDynamics(buildingApplications);
        var registeredApplications = versionedApplications.Concat(nonVersionedApplications)
            .DistinctBy(x => x.id).Where(x => x.ApplicationStatus.HasFlag(BuildingApplicationStatus.PaymentComplete))
            .Select(x => x.Sections.Select(section => new PublicRegisterStructureModel
            {
                ApplicationId = x.id,
                ContactLastName = x.ContactLastName,
                ContactFirstName = x.ContactFirstName,
                BuildingName = x.BuildingName,
                Structure = section,
                AccountablePersons = x.AccountablePersons.Select(ap =>
                {
                    var publicRegisterAccountablePerson = new PublicRegisterAccountablePerson(ap.Type, ap.IsPrincipal, ap.OrganisationName, ap.SectionsAccountability);
                    if (publicRegisterAccountablePerson.Type == "organisation" || publicRegisterAccountablePerson.IsPrincipal == "yes")
                    {
                        publicRegisterAccountablePerson = publicRegisterAccountablePerson with
                        {
                            Address = ap.Address,
                            PapAddress = ap.PapAddress
                        };
                    }

                    return publicRegisterAccountablePerson;
                }).ToList()
            })).SelectMany(x => x).ToList();

        return await request.CreateObjectResponseAsync(registeredApplications);
    }

    [Function(nameof(GetStructuresForApplication))]
    public async Task<HttpResponseData> GetStructuresForApplication([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", Id = "{applicationId}", PartitionKey = "{applicationId}", Connection = "CosmosConnection")]
        BuildingApplicationModel buildingApplication)
    {
        if (featureOptions.EnablePublicRegisterPasswordProtection && (!request.Headers.TryGetValues("PublicRegisterPassword", out var headerValues) || headerValues.FirstOrDefault() != publicRegisterOptions.Password))
        {
            return request.CreateResponse(HttpStatusCode.BadRequest);
        }

        if (!buildingApplication.ApplicationStatus.HasFlag(BuildingApplicationStatus.PaymentComplete)) return request.CreateResponse();

        var acceptedApplications = await GetAcceptedVersionFromDynamics(new List<BuildingApplicationModel> { buildingApplication });
        var toReturn = acceptedApplications[0].Sections.Select(structure => new PublicRegisterStructureModel
        {
            ApplicationId = buildingApplication.Id,
            ContactLastName = buildingApplication.ContactLastName,
            ContactFirstName = buildingApplication.ContactFirstName,
            BuildingName = buildingApplication.BuildingName,
            Structure = structure,
            AccountablePersons = acceptedApplications[0].AccountablePersons.Select(ap =>
            {
                var publicRegisterAccountablePerson = new PublicRegisterAccountablePerson(ap.Type, ap.IsPrincipal, ap.OrganisationName, ap.SectionsAccountability);
                if (publicRegisterAccountablePerson.Type == "organisation" || publicRegisterAccountablePerson.IsPrincipal == "yes")
                {
                    publicRegisterAccountablePerson = publicRegisterAccountablePerson with
                    {
                        Address = ap.Address,
                        PapAddress = ap.PapAddress
                    };
                }

                return publicRegisterAccountablePerson;
            }).ToList()
        }).ToList();

        return await request.CreateObjectResponseAsync(toReturn);
    }

    private async Task<List<PublicRegisterApplicationModel>> GetAcceptedVersionFromDynamics(List<BuildingApplicationModel> buildingApplications)
    {
        var applicationsToReturn = new List<PublicRegisterApplicationModel>();

        foreach (var application in buildingApplications.DistinctBy(x => x.Id).Where(x => x.ApplicationStatus.HasFlag(BuildingApplicationStatus.PaymentComplete)))
        {
            var app = new PublicRegisterApplicationModel
            {
                id = application.Id,
                ContactLastName = application.ContactLastName,
                ContactFirstName = application.ContactFirstName,
                ApplicationStatus = application.ApplicationStatus,
                BuildingName = application.BuildingName
            };

            if (application.Versions == null || application.Versions.Count == 1)
            {
                applicationsToReturn.Add(app with
                {
                    Sections = (application.CurrentVersion?.Sections ?? application.Sections).ToList(),
                    AccountablePersons = (application.CurrentVersion?.AccountablePersons ?? application.AccountablePersons).ToList()
                });
            }
            else
            {
                var versions = application.Versions.ToList();
                versions.Reverse();

                var validVersion = application.Versions.First();
                foreach (var version in versions)
                {
                    var change = version.ChangeRequest?.FirstOrDefault()?.Change?.FirstOrDefault();
                    if (change == null)
                    {
                        applicationsToReturn.Add(app with
                        {
                            Sections = validVersion.Sections.ToList(),
                            AccountablePersons = validVersion.AccountablePersons.ToList()
                        });
                        break;
                    }

                    var dynamicsChanges = await dynamicsApi.Get<DynamicsResponse<DynamicsChange>>("bsr_changes",
                        ("$filter", $"bsr_fieldname eq '{change.FieldName}' and bsr_originalanswer eq '{change.OriginalAnswer}' and bsr_newanswer eq '{change.NewAnswer}'"),
                        ("$expand", "bsr_changerequestid")
                    );

                    var dynamicsChange = dynamicsChanges.value.FirstOrDefault();
                    if (dynamicsChange?.bsr_changerequestid.statuscode is 760_810_007 or 2)
                    {
                        applicationsToReturn.Add(app with
                        {
                            Sections = version.Sections.ToList(),
                            AccountablePersons = version.AccountablePersons.ToList()
                        });

                        break;
                    }
                }
            }
        }

        return applicationsToReturn;
    }
}

public record PublicRegisterApplicationModel
{
    public string id { get; set; }
    public string ContactFirstName { get; set; }
    public string ContactLastName { get; set; }
    public BuildingApplicationStatus ApplicationStatus { get; set; }
    public string BuildingName { get; set; }
    public List<SectionModel> Sections { get; set; }
    public List<AccountablePerson> AccountablePersons { get; set; }
    public BuildingApplicationVersion CurrentVersion { get; set; }
}

public class PublicRegisterStructureModel
{
    public string ApplicationId { get; set; }
    public string ContactFirstName { get; set; }
    public string ContactLastName { get; set; }
    public string BuildingName { get; set; }
    public SectionModel Structure { get; set; }
    public List<PublicRegisterAccountablePerson> AccountablePersons { get; set; }
}

public record PublicRegisterAccountablePerson(
    string Type,
    string IsPrincipal,
    string OrganisationName,
    SectionAccountability[] SectionsAccountability)
{
    public BuildingAddress Address { get; set; }
    public BuildingAddress PapAddress { get; set; }
};