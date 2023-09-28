
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
        if(newPrimaryUser.Email != null && newPrimaryUser.Firstname != null && !newPrimaryUser.Email.Equals(string.Empty)) {
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

        string applicantReferenceId = buildingApplicationModel.IsSecondary ?? false 
            ? dynamicsBuildingApplication._bsr_secondaryapplicantid_value
            : dynamicsBuildingApplication._bsr_registreeid_value;


        ChangeRequest changeRequest = buildingApplicationModel.RegistrationAmendmentsModel.ChangeRequest;
        
        if (changeRequest != null) {
            DynamicsChangeRequest dynamicsChangeRequest = new DynamicsChangeRequest {
                bsr_declaration = changeRequest.Declaration,
                bsr_reviewrequired = changeRequest.ReviewRequired,
                buildingApplicationId = $"/bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})",
                changeCategory = $"/bsr_changecategories({DynamicsChangeCategory[changeRequest.Category]})",
                applicantReferenceId = $"/contacts({applicantReferenceId})"
            };

            var response = await dynamicsApi.Create("bsr_changerequests", dynamicsChangeRequest);
            string changeRequestId = dynamicsService.ExtractEntityIdFromHeader(response.Headers);

            foreach (Change change in changeRequest.Change) {
                DynamicsChange dynamicsChange = new DynamicsChange {
                    changeRequestId = $"/bsr_changerequests({changeRequestId})",
                    bsr_fieldname = change.FieldName,
                    bsr_newanswer = change.NewAnswer,
                    bsr_originalanswer = change.OriginalAnswer,
                    bsr_table = change.Table,
                };
                await dynamicsApi.Create("bsr_changes", dynamicsChange);
            }

            return request.CreateResponse(HttpStatusCode.OK);
        }
        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    private Dictionary<ChangeCategory, string> DynamicsChangeCategory = new Dictionary<ChangeCategory, string>() {
        {ChangeCategory.ApplicationBuildingAmendments, "c3d77a4f-6051-ee11-be6f-002248c725da"},
        {ChangeCategory.ChangeApplicantUser, "2bd56b5b-6051-ee11-be6f-002248c725da"},
        {ChangeCategory.DeRegistration, "71e16861-6051-ee11-be6f-002248c725da"},
    };
}
