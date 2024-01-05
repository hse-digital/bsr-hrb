using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Functions;

public class PublicRegisterFunctions
{
    [Function(nameof(SearchPublicRegister))]
    public Task<HttpResponseData> SearchPublicRegister([HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequestData request,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT c.id, c.ApplicationStatus, c.BuildingName, c.Sections FROM c JOIN s IN c.CurrentVersion.Sections JOIN a IN s.Addresses WHERE REPLACE(a.Postcode, ' ', '') = REPLACE({postcode}, ' ', '') OR REPLACE(a.PostcodeEntered, ' ', '') = REPLACE({postcode}, ' ', '')",
            Connection = "CosmosConnection")]
        List<PublicRegisterApplicationModel> buildingApplications,
        [CosmosDBInput("hseportal", "building-registrations", SqlQuery = "SELECT c.id, c.ApplicationStatus, c.BuildingName, c.Sections FROM c JOIN s IN c.Sections JOIN a IN s.Addresses WHERE REPLACE(a.Postcode, ' ', '') = REPLACE({postcode}, ' ', '') OR REPLACE(a.PostcodeEntered, ' ', '') = REPLACE({postcode}, ' ', '')",
            Connection = "CosmosConnection")]
        List<PublicRegisterApplicationModel> nonVersionedApplications)
    {
        var registeredApplications = nonVersionedApplications.Concat(nonVersionedApplications)
            .DistinctBy(x => x.id).Where(x => x.ApplicationStatus.HasFlag(BuildingApplicationStatus.PaymentComplete)).ToList();
        return request.CreateObjectResponseAsync(registeredApplications);
    }
}

public class PublicRegisterApplicationModel
{
    public string id { get; set; }   
    public BuildingApplicationStatus ApplicationStatus { get; set; }
    public string BuildingName { get; set; }
    public List<SectionModel> Sections { get; set; }
}