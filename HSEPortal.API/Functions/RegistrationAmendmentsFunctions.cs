
using System.Net;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.DurableTask;
using Microsoft.DurableTask.Client;

namespace HSEPortal.API.Functions;

public class RegistrationAmendmentsFunctions
{
    private readonly RegistrationAmendmentsService RaService;
    private readonly DynamicsApi dynamicsApi;
    private readonly DynamicsService dynamicsService;

    public RegistrationAmendmentsFunctions(RegistrationAmendmentsService RaService, DynamicsApi dynamicsApi, DynamicsService dynamicsService)
    {
        this.RaService = RaService;
        this.dynamicsApi = dynamicsApi;
        this.dynamicsService = dynamicsService;
    }

    [Function(nameof(UpdatePrimaryApplicant))]
    public async Task<HttpResponseData> UpdatePrimaryApplicant([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(UpdatePrimaryApplicant)}/{{applicationId}}")] HttpRequestData request, string applicationId)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var dynamicsBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationId);

        var newPrimaryUser = buildingApplicationModel.RegistrationAmendmentsModel.ChangeUser.NewPrimaryUser;
        if(newPrimaryUser != null && newPrimaryUser.Email != null && newPrimaryUser.Firstname != null && !newPrimaryUser.Email.Equals(string.Empty)) {
            var contact = await RaService.CreateContactAsync(newPrimaryUser.Email, newPrimaryUser.Firstname, newPrimaryUser.Lastname, newPrimaryUser.PhoneNumber);
            await dynamicsApi.Update($"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})",
                new DynamicsBuildingApplication { contactReferenceId = $"/contacts({contact.Id})" });
            return request.CreateResponse(HttpStatusCode.OK);
        }
        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    [Function(nameof(CreateSecondaryApplicant))]
    public async Task<HttpResponseData> CreateSecondaryApplicant([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(CreateSecondaryApplicant)}/{{applicationId}}")] HttpRequestData request, string applicationId)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var secondaryBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationId);

        if(buildingApplicationModel.SecondaryEmailAddress != null && buildingApplicationModel.SecondaryFirstName != null && !buildingApplicationModel.SecondaryEmailAddress.Equals(string.Empty)) {
            var contact = await RaService.CreateContactAsync(buildingApplicationModel.SecondaryEmailAddress, buildingApplicationModel.SecondaryFirstName, buildingApplicationModel.SecondaryLastName, buildingApplicationModel.SecondaryPhoneNumber);
            await dynamicsApi.Update($"bsr_buildingapplications({secondaryBuildingApplication.bsr_buildingapplicationid})",
                new DynamicsBuildingApplication { secondaryContactReferenceId = $"/contacts({contact.Id})" });
            return request.CreateResponse(HttpStatusCode.OK);
        }
        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    [Function(nameof(DeleteSecondaryUserLookup))]
    public async Task<HttpResponseData> DeleteSecondaryUserLookup([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(DeleteSecondaryUserLookup)}/{{applicationId}}")] HttpRequestData request, string applicationId)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var secondaryBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationId);

        if(buildingApplicationModel.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser?.Status == Status.Removed) {
            await dynamicsApi.Delete($"bsr_buildingapplications({secondaryBuildingApplication.bsr_buildingapplicationid})/bsr_secondaryapplicantid/$ref");
            return request.CreateResponse(HttpStatusCode.OK);
        }
        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    [Function(nameof(CreateChangeRequest))]
    public async Task<HttpResponseData> CreateChangeRequest([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(CreateChangeRequest)}/{{applicationId}}")] HttpRequestData request, string applicationId){
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var dynamicsBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationId);

        string applicantReferenceId = (buildingApplicationModel.IsSecondary ?? false)
            ? dynamicsBuildingApplication._bsr_secondaryapplicantid_value
            : dynamicsBuildingApplication._bsr_registreeid_value;

        if (applicantReferenceId == null && (buildingApplicationModel.IsSecondary ?? false)) {
            var secondaryContact = await dynamicsService.FindExistingContactAsync( 
                buildingApplicationModel.SecondaryFirstName,
                buildingApplicationModel.SecondaryLastName,
                buildingApplicationModel.SecondaryEmailAddress,
                buildingApplicationModel.SecondaryPhoneNumber);
            applicantReferenceId = secondaryContact.contactid;
        }

        ChangeRequest changeRequest = buildingApplicationModel.RegistrationAmendmentsModel.ChangeRequest;
        
        if (changeRequest != null) {            
            var changeRequestResponse = await RaService.CreateChangeRequest(changeRequest, dynamicsBuildingApplication.bsr_buildingapplicationid, applicantReferenceId);
            string changeRequestId = dynamicsService.ExtractEntityIdFromHeader(changeRequestResponse.Headers);
            foreach (Change change in changeRequest.Change) {
                await RaService.CreateChange(change, changeRequestId);
            }
            return request.CreateResponse(HttpStatusCode.OK);
        }
        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    [Function(nameof(GetChangeRequest))]
    public async Task<ChangeRequest> GetChangeRequest([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetChangeRequest/{applicationNumber}")] HttpRequestData request, string applicationNumber){

        var dynamicsBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationNumber);
        string buildingApplicationId = dynamicsBuildingApplication.bsr_buildingapplicationid;

        var changeRequests = await dynamicsApi.Get<DynamicsResponse<DynamicsChangeRequestResponse>>("bsr_changerequests",
            ("$filter", $"_bsr_buildingapplicationid_value eq '{buildingApplicationId.EscapeSingleQuote()}'"),
            ("$expand", "bsr_change_changerequestid"),
            ("$orderby", "createdon desc"));

        var changeRequest = changeRequests.value.First();
        
        return RaService.BuildChangeRequestResponse(changeRequest);
    }
}
