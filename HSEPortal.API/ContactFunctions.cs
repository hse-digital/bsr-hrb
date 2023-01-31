using Flurl.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace HSEPortal.API;

public class ContactFunctions
{
    [Function(nameof(SaveContactDetails))]
    public async Task<HttpResponseData> SaveContactDetails([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestMessage request)
    {
        await "https://dynamicsapi".GetAsync();
        
        return null;
    }
}