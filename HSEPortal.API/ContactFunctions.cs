using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Text.Json;
using HSEPortal.API.Models;

namespace HSEPortal.API;

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

        await dynamicsService.SaveContactRecord(contactDetails);
    }
}