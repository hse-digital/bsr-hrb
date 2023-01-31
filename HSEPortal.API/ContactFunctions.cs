using Flurl.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Text.Json;
using HSEPortal.API.Models;

namespace HSEPortal.API;

public class ContactFunctions
{
    [Function(nameof(SaveContactDetailsName))]
    public async Task SaveContactDetailsName([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData request)
    {
        var contactDetails = JsonSerializer.Deserialize<ContactDetails>(request.Body);

        await "https://dynamicsapi"
            .PostJsonAsync(contactDetails);
    }
}