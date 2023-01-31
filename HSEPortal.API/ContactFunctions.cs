using Flurl;
using Flurl.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Diagnostics;

namespace HSEPortal.API;

public class ContactFunctions
{
    [Function(nameof(SaveContactDetailsName))]
    public async Task<IFlurlResponse> SaveContactDetailsName([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestMessage request)
    {
        string firstName = request.Headers.GetValues("firstName").First();
        string lastName = request.Headers.GetValues("lastName").First();

        var response = await "https://dynamicsapi"
            .PostJsonAsync(new { firstName = firstName, lastName = lastName});
        
        return response;
    }

    [Function(nameof(SaveContactDetailsPhoneNumber))]
    public async Task<IFlurlResponse> SaveContactDetailsPhoneNumber([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestMessage request)
    {
        string phoneNumber = request.Headers.GetValues("phoneNumber").First();

        var response = await "https://dynamicsapi"
            .PostJsonAsync(new { phoneNumber = phoneNumber });

        return response;
    }

    [Function(nameof(SaveContactDetailsEmail))]
    public async Task<IFlurlResponse> SaveContactDetailsEmail([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestMessage request)
    {
        string email = request.Headers.GetValues("email").First();

        var response = await "https://dynamicsapi"
            .PostJsonAsync(new { email = email });

        return response;
    }

}