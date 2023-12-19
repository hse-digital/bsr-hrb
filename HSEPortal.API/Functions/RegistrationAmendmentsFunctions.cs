using System.Net;
using HSEPortal.API.Extensions;
using HSEPortal.API.Model;
using HSEPortal.API.Services;
using HSEPortal.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

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
    public async Task<HttpResponseData> UpdatePrimaryApplicant(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(UpdatePrimaryApplicant)}/{{applicationId}}")]
        HttpRequestData request, string applicationId)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var dynamicsBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationId);

        var newPrimaryUser = buildingApplicationModel.RegistrationAmendmentsModel.ChangeUser.NewPrimaryUser;
        if (newPrimaryUser != null && newPrimaryUser.Email != null && newPrimaryUser.Firstname != null && !newPrimaryUser.Email.Equals(string.Empty))
        {
            var contact = await RaService.CreateContactAsync(newPrimaryUser.Email, newPrimaryUser.Firstname, newPrimaryUser.Lastname, newPrimaryUser.PhoneNumber);
            await dynamicsApi.Update($"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})",
                new DynamicsBuildingApplication { contactReferenceId = $"/contacts({contact.Id})" });
            return request.CreateResponse(HttpStatusCode.OK);
        }

        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    [Function(nameof(CreateSecondaryApplicant))]
    public async Task<HttpResponseData> CreateSecondaryApplicant(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(CreateSecondaryApplicant)}/{{applicationId}}")]
        HttpRequestData request, string applicationId)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var secondaryBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationId);

        if (buildingApplicationModel.SecondaryEmailAddress != null && buildingApplicationModel.SecondaryFirstName != null && !buildingApplicationModel.SecondaryEmailAddress.Equals(string.Empty))
        {
            var contact = await RaService.CreateContactAsync(buildingApplicationModel.SecondaryEmailAddress, buildingApplicationModel.SecondaryFirstName, buildingApplicationModel.SecondaryLastName,
                buildingApplicationModel.SecondaryPhoneNumber);
            await dynamicsApi.Update($"bsr_buildingapplications({secondaryBuildingApplication.bsr_buildingapplicationid})",
                new DynamicsBuildingApplication { secondaryContactReferenceId = $"/contacts({contact.Id})" });
            return request.CreateResponse(HttpStatusCode.OK);
        }

        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    [Function(nameof(DeleteSecondaryUserLookup))]
    public async Task<HttpResponseData> DeleteSecondaryUserLookup(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(DeleteSecondaryUserLookup)}/{{applicationId}}")]
        HttpRequestData request, string applicationId)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var secondaryBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationId);

        if (buildingApplicationModel.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser?.Status == Status.Removed)
        {
            await dynamicsApi.Delete($"bsr_buildingapplications({secondaryBuildingApplication.bsr_buildingapplicationid})/bsr_secondaryapplicantid/$ref");
            return request.CreateResponse(HttpStatusCode.OK);
        }

        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    [Function(nameof(CreateChangeRequest))]
    public async Task<HttpResponseData> CreateChangeRequest([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(CreateChangeRequest)}/{{applicationId}}")] HttpRequestData request,
        string applicationId)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var dynamicsBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationId);

        string applicantReferenceId = (buildingApplicationModel.IsSecondary ?? false)
            ? dynamicsBuildingApplication._bsr_secondaryapplicantid_value
            : dynamicsBuildingApplication._bsr_registreeid_value;

        if (applicantReferenceId == null && (buildingApplicationModel.IsSecondary ?? false))
        {
            var secondaryContact = await dynamicsService.FindExistingContactAsync(
                buildingApplicationModel.SecondaryFirstName,
                buildingApplicationModel.SecondaryLastName,
                buildingApplicationModel.SecondaryEmailAddress,
                buildingApplicationModel.SecondaryPhoneNumber);
            applicantReferenceId = secondaryContact.contactid;
        }

        ChangeRequest[] ChangeRequests = buildingApplicationModel.CurrentVersion.ChangeRequest.Where(x => x.Status != Status.ChangesSubmitted).ToArray();
        foreach (ChangeRequest changeRequest in ChangeRequests)
        {
            var dynamicsStructure = await GetDynamicsStructure(changeRequest, applicationId);
            var changeRequestResponse = await RaService.CreateChangeRequest(changeRequest, dynamicsBuildingApplication.bsr_buildingapplicationid, applicantReferenceId,
                dynamicsBuildingApplication._bsr_building_value, dynamicsStructure);
            if (changeRequest.Change != null && changeRequest.Change.Length > 0)
            {
                string changeRequestId = dynamicsService.ExtractEntityIdFromHeader(changeRequestResponse.Headers);
                foreach (Change change in changeRequest.Change)
                {
                    await RaService.CreateChange(change, changeRequestId);
                }
            }
        }

        await UpdateBuildingApplicationPreviousPap(dynamicsBuildingApplication, ChangeRequests);

        return request.CreateResponse(HttpStatusCode.OK);
    }

    private async Task<DynamicsStructure> GetDynamicsStructure(ChangeRequest changeRequest, string applicationId)
    {
        if (changeRequest.StructureName != null && changeRequest.StructurePostcode != null)
        {
            return await RaService.GetDynamicsStructure(changeRequest.StructureName, changeRequest.StructurePostcode, applicationId);
        }

        return null;
    }

    [Function(nameof(GetChangeRequest))]
    public async Task<ChangeRequest[]> GetChangeRequest([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetChangeRequest/{applicationNumber}")] HttpRequestData request,
        string applicationNumber)
    {
        var dynamicsBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationNumber);
        string buildingApplicationId = dynamicsBuildingApplication.bsr_buildingapplicationid;

        var changeRequests = await dynamicsApi.Get<DynamicsResponse<DynamicsChangeRequestResponse>>("bsr_changerequests",
            ("$filter", $"_bsr_buildingapplicationid_value eq '{buildingApplicationId.EscapeSingleQuote()}'"),
            ("$expand", "bsr_change_changerequestid"),
            ("$orderby", "createdon desc"));

        List<DynamicsChangeRequestResponse> dynamicsResponse = new List<DynamicsChangeRequestResponse>
        {
            changeRequests.value.Find(x => RaService.IsCategoryValueEqualsTo(ChangeCategory.ApplicationBuildingAmendments, x._bsr_changecategoryid_value)),
            changeRequests.value.Find(x => RaService.IsCategoryValueEqualsTo(ChangeCategory.ChangePAPOrLeadContact, x._bsr_changecategoryid_value)),
            changeRequests.value.Find(x => RaService.IsCategoryValueEqualsTo(ChangeCategory.ChangeApplicantUser, x._bsr_changecategoryid_value))
        };

        return RaService.BuildChangeRequestResponse(dynamicsResponse.Where(x => x != null).ToList());
    }

    [Function(nameof(UpdateRemovedStructures))]
    public async Task<HttpResponseData> UpdateRemovedStructures(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(UpdateRemovedStructures)}/{{applicationId}}/{{versionName}}")]
        HttpRequestData request, string applicationId,
        string versionName)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();

        var removedStructures = buildingApplicationModel.Versions.Find(x => x.Name.Equals(versionName)).Sections
            .Where(x => x.CancellationReason != CancellationReason.NoCancellationReason && x.Addresses is { Length: > 0 } && x.Status != Status.Removed).ToArray();

        foreach (var section in removedStructures)
        {
            var dynamicsStructure = await RaService.GetDynamicsStructure(section.Name, section.Addresses[0].Postcode, applicationId);
            var updatedStructure = new DynamicsStructure
                { bsr_cancellationreason = $"/bsr_cancellationreasons({DynamicsCancellationReason[section.CancellationReason]})", statuscode = 760_810_007 }; // statuscode -> cancelled
            await dynamicsApi.Update($"bsr_blocks({dynamicsStructure.bsr_blockid})", updatedStructure);
        }

        return request.CreateResponse(HttpStatusCode.OK);
    }

    [Function(nameof(WithdrawApplicationOrBuilding))]
    public async Task<HttpResponseData> WithdrawApplicationOrBuilding(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(WithdrawApplicationOrBuilding)}/{{applicationId}}")]
        HttpRequestData request, string applicationId)
    {
        var buildingApplicationModel = await request.ReadAsJsonAsync<BuildingApplicationModel>();
        var dynamicsBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationId);

        var cancellationReason = buildingApplicationModel.RegistrationAmendmentsModel.Deregister.CancellationReason;

        if (RaService.IsApplicationAccepted(dynamicsBuildingApplication))
        {
            var updatedBuilding = new DynamicsBuilding { bsr_cancellationreason = $"/bsr_cancellationreasons({DynamicsCancellationReason[cancellationReason]})", bsr_registrationstatus = 760_810_002 };
            await dynamicsApi.Update($"bsr_buildings({dynamicsBuildingApplication._bsr_building_value})", updatedBuilding);
        }
        else
        {
            var updatedApplication = new DynamicsBuildingApplication
                { bsr_cancellationreason = $"/bsr_cancellationreasons({DynamicsCancellationReason[cancellationReason]})", statuscode = BuildingApplicationStatuscode.Cancelled };
            await dynamicsApi.Update($"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})", updatedApplication);
        }

        return request.CreateResponse(HttpStatusCode.OK);
    }

    [Function(nameof(DeactivateSingleStructure))]
    public async Task<HttpResponseData> DeactivateSingleStructure(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(DeactivateSingleStructure)}/{{applicationId}}/{{buildingName}}/{{postcode}}")]
        HttpRequestData request,
        string applicationId, string buildingName, string postcode)
    {
        var dynamicsBuildingApplication = await dynamicsService.GetBuildingApplicationUsingId(applicationId);

        var existingStructure = await this.dynamicsService.FindExistingStructureAsync(buildingName.EscapeSingleQuote(), postcode.EscapeSingleQuote(),
            dynamicsBuildingApplication.bsr_buildingapplicationid.EscapeSingleQuote());
        if (existingStructure != null)
        {
            var dynamicsStructure = new DynamicsStructure { statecode = 1 };
            await dynamicsApi.Update($"bsr_blocks({existingStructure.bsr_blockid})", dynamicsStructure);
            return request.CreateResponse(HttpStatusCode.OK);
        }

        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    private Dictionary<CancellationReason, string> DynamicsCancellationReason = new Dictionary<CancellationReason, string>()
    {
        { CancellationReason.NoCancellationReason, "" },
        { CancellationReason.NoConnected, "9107fc3d-8671-ee11-8178-6045bd0c1726" },
        { CancellationReason.IncorrectlyRegistered, "e098fc37-8671-ee11-8178-6045bd0c1726" },
        { CancellationReason.EveryoneMovedOut, "be615a0e-d277-ee11-8179-6045bd0c1726" },
        { CancellationReason.FloorsHeight, "f0696bf0-d177-ee11-8179-6045bd0c1726" },
        { CancellationReason.ResidentialUnits, "f7e45d02-d277-ee11-8179-6045bd0c1726" },
    };

    private async Task UpdateBuildingApplicationPreviousPap(DynamicsBuildingApplication dynamicsBuildingApplication, ChangeRequest[] changeRequests)
    {
        var application = new DynamicsBuildingApplication { bsr_previouspaptype = dynamicsBuildingApplication.bsr_paptype };
        var allChanges = changeRequests.SelectMany(x => x.Change).ToList();

        var previousPap = allChanges.FirstOrDefault(x => x.FieldName == "Principal accountable person")?.OriginalAnswer;
        if (previousPap != null)
        {
            var previousPapId = dynamicsBuildingApplication._bsr_papid_value;
            if (dynamicsBuildingApplication.bsr_paptype == 760_810_000)
            {
                application = application with
                {
                    bsr_previouspap_contact = $"/contacts({previousPapId})"
                };
            }
            else
            {
                application = application with
                {
                    bsr_previouspap_account = $"/accounts({previousPapId})"
                };
            }
        }

        var previousPapOrgLeadContactId = allChanges.FirstOrDefault(x => x.FieldName == "Principal accountable person named contact")?.OriginalAnswer;
        if (previousPapOrgLeadContactId != null)
        {
            application = application with
            {
                bsr_previouspaporgleadcontactid = dynamicsBuildingApplication.papLeadContactReferenceId,
            };
        }

        await dynamicsApi.Update($"bsr_buildingapplications({dynamicsBuildingApplication.bsr_buildingapplicationid})", application);
    }
}