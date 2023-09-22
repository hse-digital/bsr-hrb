
using HSEPortal.API.Model;
using HSEPortal.Domain.Entities;
using Microsoft.Extensions.Options;
using HSEPortal.Domain.DynamicsDefinitions;

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

}