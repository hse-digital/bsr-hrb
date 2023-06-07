using System.Text.Json.Serialization;
using HSEPortal.API.Functions;
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

    public Task<DynamicsStructure> GetDynamicsStructure(string structureName, string postcode)
    {
        return dynamicsService.FindExistingStructureAsync(structureName, postcode);
    }

    public async Task UpdateKbiStructureStart(KbiSyncData kbiSyncData)
    {
        var structure = kbiSyncData.DynamicsStructure;
        structure = structure with { bsr_kbistartdate = DateTime.Now };

        var building = await dynamicsApi.Get<DynamicsBuilding>($"bsr_buildings({structure._bsr_buildingid_value})");
        building = building with { bsr_kbistartdate = structure.bsr_kbistartdate };

        await dynamicsApi.Update($"bsr_blocks({structure.bsr_blockid})", structure);
        await dynamicsApi.Update($"bsr_buildings({building.bsr_buildingid})", building);
    }

    public async Task<DynamicsStructure> UpdateSectionFireData(KbiSyncData kbiSyncData)
    {
        var structure = kbiSyncData.DynamicsStructure;

        // evacuation policy
        structure = structure with { bsr_evacuationpolicy_blockid = $"/bsr_evacuationpolicies({DynamicsSectionEvacuation.Ids[kbiSyncData.KbiSectionModel.StrategyEvacuateBuilding]})" };

        // fire and smoke control equipment
        var fireAndSmokeProvisions = await GetOrCreateFireOrSmokeProvisions(structure.bsr_blockid);
        fireAndSmokeProvisions = fireAndSmokeProvisions with
        {
            // ProvisionsEquipment
        };

        return structure;
    }

    public async Task UpdateSectionEnergyData(KbiSyncData kbiSyncData)
    {
        await Task.CompletedTask;
    }

    public async Task UpdateSectionStructureData(KbiSyncData kbiSyncData)
    {
        await Task.CompletedTask;
    }

    public async Task UpdateSectionRoofData(KbiSyncData kbiSyncData)
    {
        await Task.CompletedTask;
    }

    public async Task UpdateSectionStaircasesData(KbiSyncData kbiSyncData)
    {
        await Task.CompletedTask;
    }

    public async Task UpdateSectionWallsData(KbiSyncData kbiSyncData)
    {
        await Task.CompletedTask;
    }

    public async Task UpdateSectionBuildingUseData(KbiSyncData kbiSyncData)
    {
        await Task.CompletedTask;
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