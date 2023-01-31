using Flurl;
using Flurl.Http;
using HSEPortal.API.Models;
using Microsoft.Extensions.Configuration;

namespace HSEPortal.API;

public class DynamicsService
{
    public const string EnvironmentUrlSettingName = "DynamicsEnvironmentUrl";
    private readonly string environmentUrl;

    public DynamicsService(IConfiguration configuration)
    {
        environmentUrl = configuration[EnvironmentUrlSettingName];
    }

    public async Task SaveContactRecord(ContactDetails contactDetails)
    {
        await environmentUrl.AppendPathSegment("contacts").PostJsonAsync(contactDetails);
    }

    public async Task SaveBuildingDetailsRecord(BuildingDetails buildingDetails)
    {
        await environmentUrl.AppendPathSegment("bsr_blocks").PostJsonAsync(buildingDetails);
    }
}