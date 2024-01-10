using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Functions;

public class PublicRegisterFunctions
{
    [Function(nameof(SearchPublicRegister))]
    public Task<HttpResponseData> SearchPublicRegister([HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT c.id, c.ContactFirstName, c.ContactLastName, c.ApplicationStatus, c.BuildingName, c.CurrentVersion.Sections as Sections, c.CurrentVersion.AccountablePersons as AccountablePersons FROM c JOIN s IN c.CurrentVersion.Sections JOIN a IN s.Addresses WHERE a.Postcode = {postcode} OR a.PostcodeEntered = {postcode}",
            Connection = "CosmosConnection")]
        List<PublicRegisterApplicationModel> buildingApplications,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT c.id, c.ContactFirstName, c.ContactLastName, c.ApplicationStatus, c.BuildingName, c.Sections, c.AccountablePersons as AccountablePersons FROM c JOIN s IN c.Sections JOIN a IN s.Addresses WHERE a.Postcode = {postcode} OR a.PostcodeEntered = {postcode}",
            Connection = "CosmosConnection")]
        List<PublicRegisterApplicationModel> nonVersionedApplications)
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
                AccountablePersons = x.AccountablePersons
            })).SelectMany(x => x).ToList();
        
        return request.CreateObjectResponseAsync(registeredApplications);
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
}

public class PublicRegisterStructureModel
{
    public string ApplicationId { get; set; }
    public string ContactFirstName { get; set; }
    public string ContactLastName { get; set; }
    public string BuildingName { get; set; }
    public SectionModel Structure { get; set; }
    public List<AccountablePerson> AccountablePersons { get; set; }
}