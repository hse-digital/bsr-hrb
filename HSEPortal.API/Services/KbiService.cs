using System.Text.Json.Serialization;
using HSEPortal.API.Model;
using HSEPortal.Domain.Entities;

namespace HSEPortal.API.Services;

public class KbiService
{
    private readonly DynamicsService dynamicsService;
    private readonly DynamicsApi dynamicsApi;

    public KbiService(DynamicsService dynamicsService, DynamicsApi dynamicsApi)
    {
        this.dynamicsService = dynamicsService;
        this.dynamicsApi = dynamicsApi;
    }

    public async Task UpdateSectionFireData(KbiSectionModel kbiSectionModel)
    {
        var structure = await dynamicsService.FindExistingStructureAsync(kbiSectionModel.StructureName, kbiSectionModel.Postcode);

        // evacuation policy
        structure = structure with { bsr_evacuationpolicy_blockid = $"/bsr_evacuationpolicies({DynamicsSectionEvacuation.Ids[kbiSectionModel.StrategyEvacuateBuilding]})" };
        
        // fire and smoke control equipment
        var fireAndSmokeProvisions = await GetOrCreateFireOrSmokeProvisions(structure.bsr_blockid);
        fireAndSmokeProvisions = fireAndSmokeProvisions with
        {
            // ProvisionsEquipment
        };
    }

    private async Task<DynamicsFireAndSmokeProvisions> GetOrCreateFireOrSmokeProvisions(string blockId)
    {
        var record = await dynamicsApi.Get<DynamicsResponse<DynamicsFireAndSmokeProvisions>>("bsr_blockfiresmokeprovisions", ("$filter", $"_bsr_blockid_value eq '{blockId}'"));
        if (!record.value.Any())
        {
            return new DynamicsFireAndSmokeProvisions(_bsr_blockid_value: blockId);
        }

        return record.value[0];
    }
}

public record DynamicsFireAndSmokeProvisions(string bsr_blockfiresmokeprovisionid = null, string _bsr_blockid_value = null,
    [property: JsonPropertyName("bsr_FireSmokeProvisionId@odata.bind")]
    string bsr_FireSmokeProvisionId = null);