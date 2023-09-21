
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
                new DynamicsBuildingApplication { contactReferenceId = $"/contacts({contact.Id})" });
            return request.CreateResponse(HttpStatusCode.OK);
        }
        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    [Function(nameof(UpdateSecondaryApplicant))]
    public HttpResponseData UpdateSecondaryApplicant([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(UpdateSecondaryApplicant)}/{{applicationId}}")] HttpRequestData request,
        [DurableClient] DurableTaskClient durableTaskClient, string applicationId)
    {
        return request.CreateResponse(HttpStatusCode.OK);
    }
}
