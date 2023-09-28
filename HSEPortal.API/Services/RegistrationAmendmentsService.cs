
using HSEPortal.API.Model;
using HSEPortal.Domain.Entities;
using Microsoft.Extensions.Options;
using HSEPortal.Domain.DynamicsDefinitions;
using Flurl.Http;

namespace HSEPortal.API.Services;

public class RegistrationAmendmentsService
{
    private readonly DynamicsService dynamicsService;
    private readonly DynamicsApi dynamicsApi;
    private readonly DynamicsOptions dynamicsOptions;
    private readonly DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory;

    public RegistrationAmendmentsService(DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory, DynamicsService dynamicsService, DynamicsApi dynamicsApi, IOptions<DynamicsOptions> dynamicsOptions)
    {
        this.dynamicsService = dynamicsService;
        this.dynamicsApi = dynamicsApi;
        this.dynamicsOptions = dynamicsOptions.Value;
        this.dynamicsModelDefinitionFactory = dynamicsModelDefinitionFactory;
    }

    public async Task<Contact> CreateContactAsync(string email, string firstname, string lastname, string phoneNumber)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Contact, DynamicsContact>();
        var contact = new Contact(firstname, lastname, phoneNumber, email);
        var dynamicsContact = modelDefinition.BuildDynamicsEntity(contact);

        var existingContact = await dynamicsService.FindExistingContactAsync(contact.FirstName, contact.LastName, contact.Email, contact.PhoneNumber);
        if (existingContact == null)
        {
            var response = await dynamicsApi.Create(modelDefinition.Endpoint, dynamicsContact);
            var contactId = dynamicsService.ExtractEntityIdFromHeader(response.Headers);
            await dynamicsService.AssignContactType(contactId, DynamicsContactTypes.HRBRegistrationApplicant);

            return contact with { Id = contactId };
        }

        return contact with { Id = existingContact.contactid };
    }

    public async Task<IFlurlResponse> CreateChangeRequest(ChangeRequest changeRequest, string bsr_buildingapplicationid, string applicantReferenceId)
    {
        DynamicsChangeRequest dynamicsChangeRequest = new DynamicsChangeRequest {
            bsr_declaration = changeRequest.Declaration,
            bsr_reviewrequired = changeRequest.ReviewRequired,
            buildingApplicationId = $"/bsr_buildingapplications({bsr_buildingapplicationid})",
            changeCategory = $"/bsr_changecategories({DynamicsChangeCategory[changeRequest.Category]})",
            applicantReferenceId = $"/contacts({applicantReferenceId})"
        };

        return await dynamicsApi.Create("bsr_changerequests", dynamicsChangeRequest);
    }

    public async Task<IFlurlResponse> CreateChange(Change change, string changeRequestId)
    {
        DynamicsChange dynamicsChange = new DynamicsChange {
            changeRequestId = $"/bsr_changerequests({changeRequestId})",
            bsr_fieldname = change.FieldName,
            bsr_newanswer = change.NewAnswer,
            bsr_originalanswer = change.OriginalAnswer,
            bsr_table = change.Table,
        };
        return await dynamicsApi.Create("bsr_changes", dynamicsChange);
    }

    private Dictionary<ChangeCategory, string> DynamicsChangeCategory = new Dictionary<ChangeCategory, string>() {
        {ChangeCategory.ApplicationBuildingAmendments, "c3d77a4f-6051-ee11-be6f-002248c725da"},
        {ChangeCategory.ChangeApplicantUser, "2bd56b5b-6051-ee11-be6f-002248c725da"},
        {ChangeCategory.DeRegistration, "71e16861-6051-ee11-be6f-002248c725da"},
    };

}