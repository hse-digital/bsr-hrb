using Flurl.Http;
using HSEPortal.API.Models;

namespace HSEPortal.API;

public class DynamicsService
{
    public async Task SaveContactRecord(ContactDetails contactDetails)
    {
        await "https://dynamicsapi".PostJsonAsync(contactDetails);
    }

    public async Task SaveBuildingDetailsRecord(BuildingDetails buildingDetails)
    {
        await "https://dynamicsapi".PostJsonAsync(buildingDetails);
    }
}