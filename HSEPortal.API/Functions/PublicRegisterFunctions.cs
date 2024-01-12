using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Functions;

public class PublicRegisterFunctions
{
    [Function(nameof(SearchPublicRegister))]
    public Task<HttpResponseData> SearchPublicRegister([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT c.id, c.ContactFirstName, c.ContactLastName, c.ApplicationStatus, c.BuildingName, c.CurrentVersion.Sections as Sections, c.CurrentVersion.AccountablePersons as AccountablePersons FROM c JOIN s IN c.CurrentVersion.Sections JOIN a IN s.Addresses WHERE a.Postcode = {postcode} OR a.PostcodeEntered = {postcode}", Connection = "CosmosConnection")] List<PublicRegisterApplicationModel> buildingApplications,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT c.id, c.ContactFirstName, c.ContactLastName, c.ApplicationStatus, c.BuildingName, c.Sections, c.AccountablePersons as AccountablePersons FROM c JOIN s IN c.Sections JOIN a IN s.Addresses WHERE a.Postcode = {postcode} OR a.PostcodeEntered = {postcode}", Connection = "CosmosConnection")] List<PublicRegisterApplicationModel> nonVersionedApplications)
    {
        var registeredApplications = buildingApplications.Concat(nonVersionedApplications)
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
        
        return request.CreateObjectResponseAsync(registeredApplications);
    }

    [Function(nameof(GetStructuresForApplication))]
    public async Task<HttpResponseData> GetStructuresForApplication([HttpTrigger(AuthorizationLevel.Anonymous,"get")] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", Id = "{applicationId}", PartitionKey = "{applicationId}", Connection = "CosmosConnection")] PublicRegisterApplicationModel buildingApplication)
    {
        if (!buildingApplication.ApplicationStatus.HasFlag(BuildingApplicationStatus.PaymentComplete)) return request.CreateResponse();

        var structures = buildingApplication.CurrentVersion?.Sections ?? buildingApplication.Sections.ToArray();
        var accountablePersons = buildingApplication.CurrentVersion?.AccountablePersons ?? buildingApplication.AccountablePersons.ToArray();
        var toReturn = structures.Select(structure => new PublicRegisterStructureModel
        {
            ApplicationId = buildingApplication.id,
            ContactLastName = buildingApplication.ContactLastName,
            ContactFirstName = buildingApplication.ContactFirstName,
            BuildingName = buildingApplication.BuildingName,
            Structure = structure,
            AccountablePersons = accountablePersons.Select(ap =>
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
}

public class PublicRegisterApplicationModel
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