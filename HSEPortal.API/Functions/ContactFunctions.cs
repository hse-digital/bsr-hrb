using System.Text.Json;
using HSEPortal.API.Dynamics;
using HSEPortal.API.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API.Functions;

public class ContactFunctions
{
    private readonly DynamicsService dynamicsService;

    public ContactFunctions(DynamicsService dynamicsService)
    {
        this.dynamicsService = dynamicsService;
    }

    [Function(nameof(SaveContactDetailsName))]
    public async Task SaveContactDetailsName([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData request)
    {
        var contactDetails = JsonSerializer.Deserialize<ContactDetails>(request.Body)!;

        
        await dynamicsService.SaveRecord(contactDetails);
    }
}