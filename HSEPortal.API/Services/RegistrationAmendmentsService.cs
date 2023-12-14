
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

    public async Task<IFlurlResponse> CreateChangeRequest(ChangeRequest changeRequest, string bsr_buildingapplicationid, string applicantReferenceId, string _bsr_building_value, DynamicsStructure dynamicsStructure = null)
    {
        DynamicsChangeRequest dynamicsChangeRequest = new DynamicsChangeRequest {
            bsr_declaration = changeRequest.Declaration,
            bsr_reviewrequired = changeRequest.ReviewRequired,
            buildingApplicationId = $"/bsr_buildingapplications({bsr_buildingapplicationid})",
            building = $"/bsr_buildings({_bsr_building_value})",
            changeCategory = $"/bsr_changecategories({DynamicsChangeCategory[changeRequest.Category]})",
            statuscode = 760_810_001 //submitted         
        };

        if (changeRequest.Category == ChangeCategory.ChangePAPOrLeadContact && changeRequest.Change.Any(x => x.FieldName.ToLower().Contains("principal") || x.FieldName.ToLower().Contains("pap")))
        {
            dynamicsChangeRequest = dynamicsChangeRequest with
            {
                bsr_papchangecategory = GetPAPChangeCategory(changeRequest)
            };
        }

        if (dynamicsStructure != null && dynamicsStructure.bsr_blockid != null) {
            dynamicsChangeRequest = dynamicsChangeRequest with { structure = $"/bsr_blocks({dynamicsStructure.bsr_blockid})" };
        }

        if(applicantReferenceId != null && !applicantReferenceId.Equals(string.Empty)) {
            dynamicsChangeRequest = dynamicsChangeRequest with { applicantReferenceId = $"/contacts({applicantReferenceId})" };
        }

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

    public ChangeRequest[] BuildChangeRequestResponse(List<DynamicsChangeRequestResponse> dynamicsChangeRequests) {
        List<ChangeRequest> changeRequests = new List<ChangeRequest>();

        foreach (DynamicsChangeRequestResponse dynamicsCR in dynamicsChangeRequests)
        {
            Change[] changes = new Change[dynamicsCR.bsr_change_changerequestid.Length];
            for (int i = 0; i < dynamicsCR.bsr_change_changerequestid.Length; i++) {
                DynamicsChangeResponse change = dynamicsCR.bsr_change_changerequestid[i];
                changes[i] = new Change {
                    FieldName = change.bsr_fieldname,
                    Name = change.bsr_name,
                    NewAnswer = change.bsr_newanswer,
                    OriginalAnswer = change.bsr_originalanswer,
                    Table = change.bsr_table
                };
            }

            changeRequests.Add(new ChangeRequest {
                Name = dynamicsCR.bsr_name,
                Declaration = dynamicsCR.bsr_declaration,
                ReviewRequired = dynamicsCR.bsr_reviewrequired,
                Change = changes
            });
        }
        return changeRequests.ToArray();
    }
    
    public bool IsApplicationAccepted(DynamicsBuildingApplication dynamicsBuildingApplication) {
        BuildingApplicationStatuscode statuscode = (BuildingApplicationStatuscode)dynamicsBuildingApplication.statuscode;
        return statuscode == BuildingApplicationStatuscode.Registered || statuscode == BuildingApplicationStatuscode.Registered;
    }

    public bool IsCategoryValueEqualsTo(ChangeCategory category, string categoryIdValue) {
        return DynamicsChangeCategory[category] == categoryIdValue;
    }

    private Dictionary<ChangeCategory, string> DynamicsChangeCategory = new Dictionary<ChangeCategory, string>() {
        {ChangeCategory.ApplicationBuildingAmendments, "c3d77a4f-6051-ee11-be6f-002248c725da"},
        {ChangeCategory.ChangeApplicantUser, "2bd56b5b-6051-ee11-be6f-002248c725da"},
        {ChangeCategory.DeRegistration, "71e16861-6051-ee11-be6f-002248c725da"},
        {ChangeCategory.ChangePAPOrLeadContact, "54b32c53-0b7f-ee11-8179-6045bd0c14e5"},
    };

    public async Task<DynamicsStructure> GetDynamicsStructure(string structureName, string postcode, string applicationId)
    {
        var application = await dynamicsService.GetBuildingApplicationUsingId(applicationId);
        return await dynamicsService.FindExistingStructureAsync(structureName, postcode, application.bsr_buildingapplicationid);
    }

    private int? GetPAPChangeCategory(ChangeRequest changeRequest)
    {
        var papTypeChange = changeRequest.Change.FirstOrDefault(x => x.FieldName == "PAP type"); 
        if (papTypeChange?.NewAnswer == "organization")
        {
            return 760_810_001; // PAP Individual to Organisation
        }
        if (papTypeChange?.NewAnswer == "individual")
        {
            return 760_810_003; // PAP organisation to individual
        }
        
        var papChange = changeRequest.Change.FirstOrDefault(x => x.FieldName == "Principal accountable person");
        if (papChange != null)
        {
            if (papTypeChange?.NewAnswer == "organization")
            {
                return 760_810_004; // PAP Organisation Change
            }
            
            return 760_810_000; // PAP Individual Change
        }
        
        var papNamedContactChange = changeRequest.Change.FirstOrDefault(x => x.FieldName == "Principal accountable person named contact");
        if (papNamedContactChange != null)
        {
            return 760_810_002; // PAP Org - Internal lead contact
        }

        return null;
    }
}