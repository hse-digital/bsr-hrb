using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Functions;

public class PublicRegisterFunctions
{
    private readonly DynamicsApi dynamicsApi;

    public PublicRegisterFunctions(DynamicsApi dynamicsApi)
    {
        this.dynamicsApi = dynamicsApi;
    }

    [Function(nameof(SearchPublicRegister))]
    public async Task<HttpResponseData> SearchPublicRegister([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT c.id, c.ContactFirstName, c.ContactLastName, c.ApplicationStatus, c.BuildingName, c.Versions FROM c JOIN v in c.Versions JOIN s IN v.Sections JOIN a IN s.Addresses WHERE REPLACE(a.Postcode, ' ', '') = REPLACE({postcode}, ' ', '') OR REPLACE(a.PostcodeEntered, ' ', '') = REPLACE({postcode}, ' ', '') OR a.UPRN = {uprn}", Connection = "CosmosConnection")]
        List<BuildingApplicationModel> buildingApplications,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT c.id, c.ContactFirstName, c.ContactLastName, c.ApplicationStatus, c.BuildingName, c.Sections, c.AccountablePersons as AccountablePersons FROM c JOIN s IN c.Sections JOIN a IN s.Addresses WHERE REPLACE(a.Postcode, ' ', '') = REPLACE({postcode}, ' ', '') OR REPLACE(a.PostcodeEntered, ' ', '') = REPLACE({postcode}, ' ', '') OR a.UPRN = {uprn}",
            Connection = "CosmosConnection")]
        List<PublicRegisterApplicationModel> nonVersionedApplications)
    {
        var queryParameters = request.GetQueryParameters();
        var postcode = queryParameters["postcode"];
        var uprn = queryParameters["uprn"];
        
        var versionedApplications = await GetAcceptedVersionFromDynamics(buildingApplications);
        var registeredApplications = versionedApplications.Concat(nonVersionedApplications)
            .DistinctBy(x => x.id)
            .Where(x => x.ApplicationStatus.HasFlag(BuildingApplicationStatus.PaymentInProgress))
            .Select(x => x.Sections.Where(section => SectionMatchesSearchAddress(section, postcode, uprn)).Select(section => new PublicRegisterStructureModel
            {
                code = x.id,
                userLastName = x.ContactLastName,
                userFirstName = x.ContactFirstName,
                structureName = x.BuildingName,
                structure = section,
                aps = x.AccountablePersons.Select(ap =>
                {
                    var publicRegisterAccountablePerson = new PublicRegisterAccountablePerson(ap.Type, ap.IsPrincipal, ap.OrganisationName, ap.SectionsAccountability);
                    if (publicRegisterAccountablePerson.type == "organisation" || publicRegisterAccountablePerson.isMain == "yes")
                    {
                        publicRegisterAccountablePerson = publicRegisterAccountablePerson with
                        {
                            address = ap.Address,
                            mainAddress = ap.PapAddress
                        };
                    }

                    return publicRegisterAccountablePerson;
                }).ToList()
            })).SelectMany(x => x).ToList();

        registeredApplications = await FilterRegisteredApplications(registeredApplications);
        return await request.CreateObjectResponseAsync(registeredApplications);
    }

    private bool SectionMatchesSearchAddress(SectionModel section, string postcode, string uprn)
    {
        var trimPostcode = postcode.Replace(" ", string.Empty);
        return section.Addresses.Any(address => string.Equals(address.Postcode?.Replace(" ", string.Empty), trimPostcode, StringComparison.InvariantCultureIgnoreCase) || 
                                                string.Equals(address.PostcodeEntered?.Replace(" ", string.Empty), trimPostcode, StringComparison.InvariantCultureIgnoreCase) || 
                                                string.Equals(address.UPRN, uprn, StringComparison.InvariantCultureIgnoreCase));
    }

    [Function(nameof(GetStructuresForApplication))]
    public async Task<HttpResponseData> GetStructuresForApplication([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", Id = "{applicationId}", PartitionKey = "{applicationId}", Connection = "CosmosConnection")]
        BuildingApplicationModel buildingApplication)
    {
        if (!buildingApplication.ApplicationStatus.HasFlag(BuildingApplicationStatus.PaymentInProgress)) return request.CreateResponse();

        var acceptedApplications = await GetAcceptedVersionFromDynamics(new List<BuildingApplicationModel> { buildingApplication });
        var toReturn = acceptedApplications[0].Sections.Select(structure => new PublicRegisterStructureModel
        {
            code = buildingApplication.Id,
            userLastName = buildingApplication.ContactLastName,
            userFirstName = buildingApplication.ContactFirstName,
            structureName = buildingApplication.BuildingName,
            structure = structure,
            aps = acceptedApplications[0].AccountablePersons.Select(ap =>
            {
                var publicRegisterAccountablePerson = new PublicRegisterAccountablePerson(ap.Type, ap.IsPrincipal, ap.OrganisationName, ap.SectionsAccountability);
                if (publicRegisterAccountablePerson.type == "organisation" || publicRegisterAccountablePerson.isMain == "yes")
                {
                    publicRegisterAccountablePerson = publicRegisterAccountablePerson with
                    {
                        address = ap.Address,
                        mainAddress = ap.PapAddress
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

        foreach (var application in buildingApplications.DistinctBy(x => x.Id).Where(x => x.ApplicationStatus.HasFlag(BuildingApplicationStatus.PaymentInProgress)))
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
                    if (dynamicsChange?.bsr_changerequestid?.statuscode is 760_810_007 or 2)
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

    private async Task<List<PublicRegisterStructureModel>> FilterRegisteredApplications(List<PublicRegisterStructureModel> registeredApplications)
    {
        var applicationsToReturn = new List<PublicRegisterStructureModel>();

        foreach (var application in registeredApplications)
        {
            // registrationstatus:
            //      registered - 760810000
            // application status:
            //      registered - pending qa: 760810006
            //      registered - pending change: 760810016
            //      registered - kbi validated: 760810017

            var applications = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingApplication>>("bsr_buildingapplications",
                new[]
                {
                    ("$filter", $"bsr_applicationid eq '{application.code}' and (statuscode eq 760810006 or statuscode eq 760810015 or statuscode eq 760810016 or statuscode eq 760810017) and bsr_Building/bsr_registrationstatus eq 760810000")
                });

            if (applications.value.Count > 0)
                applicationsToReturn.Add(application);
        }

        return applicationsToReturn;
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
        public string code { get; set; }
        public string userFirstName { get; set; }
        public string userLastName { get; set; }
        public string structureName { get; set; }
        public SectionModel structure { get; set; }
        public List<PublicRegisterAccountablePerson> aps { get; set; }
    }

    public record PublicRegisterAccountablePerson(
        string type,
        string isMain,
        string orgName,
        SectionAccountability[] accountability)
    {
        public BuildingAddress address { get; set; }
        public BuildingAddress mainAddress { get; set; }
    }
}