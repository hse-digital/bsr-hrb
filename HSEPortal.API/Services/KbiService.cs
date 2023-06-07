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

    public async Task UpdateSectionFireData(KbiSyncData kbiSyncData)
    {
        var fireData = kbiSyncData.KbiSectionModel.Fire;
        var structure = kbiSyncData.DynamicsStructure;

        // evacuation policy
        structure = structure with { bsr_evacuationpolicy_blockid = $"/bsr_evacuationpolicies({DynamicsSectionEvacuation.Ids[fireData.StrategyEvacuateBuilding]})" };

        // fire and smoke control equipment
        foreach (var provision in fireData.FireSmokeProvisions)
        {
            var locations = fireData.FireSmokeProvisionLocations[provision];
            await GetOrCreateFireOrSmokeProvisions(structure.bsr_blockid, provision, locations);
        }

        // lifts
        foreach (var lift in fireData.Lifts)
        {
            await CreateOrUpdateLift(structure.bsr_blockid, lift);
        }

        // doors
        structure = structure with
        {
            bsr_doorsthatcertifiedfireresistanceisnotknow = fireData.FireDoorsCommon.FireDoorUnknown,
            bsr_doorwith120minutecertifiedfireresistance = fireData.FireDoorsCommon.FireDoorHundredTwentyMinute,
            bsr_doorswith30minutescertifiedfireresistance = fireData.FireDoorsCommon.FireDoorThirtyMinute,
            bsr_doorswith60minutescertifiedfireresistance = fireData.FireDoorsCommon.FireDoorSixtyMinute,
            bsr_doorswithnocertifiedfireresistance = fireData.ResidentialUnitFrontDoors.NoFireResistance,
            bsr_doorthatcertifiedfireresistanceisnotknown = fireData.ResidentialUnitFrontDoors.NotKnownFireResistance,
            bsr_doorswith120minutecertifiedfireresistance = fireData.ResidentialUnitFrontDoors.HundredTwentyMinsFireResistance,
            bsr_doorswith30minutecertifiedfireresistance = fireData.ResidentialUnitFrontDoors.ThirtyMinsFireResistance,
            bsr_doorswith60minutecertifiedfireresistance = fireData.ResidentialUnitFrontDoors.SixtyMinsFireResistance
        };

        await dynamicsApi.Update($"bsr_blocks({structure.bsr_blockid})", structure);
    }

    public async Task UpdateSectionEnergyData(KbiSyncData kbiSyncData)
    {
        var energyData = kbiSyncData.KbiSectionModel.Energy;
        var structure = kbiSyncData.DynamicsStructure;

        foreach (var storage in energyData.EnergyTypeStorage)
        {
            var storageId = Energies.Ids[storage];
            var dynamicsStructureEnergy = new DynamicsStructureEnergy
            {
                structureId = structure.bsr_blockid,
                energyId = $"/bsr_energysupplies({storageId})",
                bsr_energytype = 760_810_000
            };

            await CreateStructureEnergyIfNotExists(structure, storageId, dynamicsStructureEnergy);
        }

        foreach (var onsite in energyData.OnsiteEnergyGeneration)
        {
            var onsiteId = Energies.Ids[onsite];
            var dynamicsStructureEnergy = new DynamicsStructureEnergy
            {
                structureId = structure.bsr_blockid,
                energyId = $"/bsr_energysupplies({onsiteId})",
                bsr_energytype = 760_810_001
            };;

            await CreateStructureEnergyIfNotExists(structure, onsiteId, dynamicsStructureEnergy);
        }

        foreach (var supply in energyData.EnergySupply)
        {
            var supplyId = Energies.Ids[supply];
            var dynamicsStructureEnergy = new DynamicsStructureEnergy
            {
                structureId = structure.bsr_blockid,
                energyId = $"/bsr_energysupplies({supplyId})",
                bsr_energytype = 760_810_002
            };

            await CreateStructureEnergyIfNotExists(structure, supplyId, dynamicsStructureEnergy);
        }
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

    private async Task GetOrCreateFireOrSmokeProvisions(string blockId, string provision, string[] locations)
    {
        var provisionId = FireSmokeProvision.Ids[provision];
        var record = new DynamicsFireAndSmokeProvisions
        {
            _bsr_blockid_value = blockId,
            bsr_FireSmokeProvisionId = $"/bsr_blockfiresmokeprovisions({provisionId})"
        };

        foreach (var location in locations)
        {
            var residentialAreaId = ResidentialAreas.Ids[location];
            record = record with
            {
                bsr_ResidentialAreaId = $"/bsr_residentialareas({residentialAreaId})"
            };

            var records = await dynamicsApi.Get<DynamicsResponse<DynamicsFireAndSmokeProvisions>>("bsr_blockfiresmokeprovisions",
                ("$filter", $"_bsr_blockid_value eq '{blockId}' and _bsr_firesmokeprovisionid_value eq '{residentialAreaId}'")
            );
            if (!records.value.Any())
            {
                await dynamicsApi.Create("bsr_blockfiresmokeprovisions", record);
            }
        }
    }

    private async Task CreateOrUpdateLift(string blockId, string lift)
    {
        var liftId = Lifts.Ids[lift];
        var record = await dynamicsApi.Get<DynamicsResponse<DynamicsStructureLift>>("bsr_structurelifts", ("$filter", $"_bsr_structure_value eq '{blockId}' and _bsr_lifts_value eq '{liftId}'"));
        if (!record.value.Any())
        {
            var dynamicsStructureLift = new DynamicsStructureLift
            {
                structureId = blockId,
                liftId = $"/bsr_lifts({liftId})"
            };

            await dynamicsApi.Create("bsr_structurelifts", dynamicsStructureLift);
        }
    }

    private async Task CreateStructureEnergyIfNotExists(DynamicsStructure structure, string energyId, DynamicsStructureEnergy dynamicsStructureEnergy)
    {
        var records = await dynamicsApi.Get<DynamicsResponse<DynamicsStructureEnergy>>("bsr_structureenergies", ("$filter", $"_bsr_structure_value eq '{structure.bsr_blockid}' and _bsr_energy_value eq '{energyId}'"));
        if (!records.value.Any())
        {
            await dynamicsApi.Create("bsr_structureenergies", dynamicsStructureEnergy);
        }
    }
}

public static class FireSmokeProvision
{
    public static Dictionary<string, string> Ids = new()
    {
        ["none"] = "244e900d-2ceb-ed11-8847-6045bd0d6904",
        ["alarm_heat_smoke"] = "1178b809-2beb-ed11-8847-6045bd0d6904",
        ["alarm_call_points"] = "d144bc2d-2beb-ed11-8847-6045bd0d6904",
        ["fire_dampers"] = "cecbdf40-2beb-ed11-8847-6045bd0d6904",
        ["fire_extinguishers"] = "",
        ["fire_shutters"] = "204f6b4d-2beb-ed11-8847-6045bd0d6904",
        ["heat_detectors"] = "9cfda059-2beb-ed11-8847-6045bd0d6904",
        ["risers_dry"] = "0bd544a6-2beb-ed11-8847-6045bd0d6904",
        ["risers_wet"] = "bfde41ac-2beb-ed11-8847-6045bd0d6904",
        ["smoke_aovs"] = "bf07bec4-2beb-ed11-8847-6045bd0d6904",
        ["smoke_manual"] = "d69dbad0-2beb-ed11-8847-6045bd0d6904",
        ["smoke_detectors"] = "2fece3e2-2beb-ed11-8847-6045bd0d6904",
        ["sprinklers_misters"] = "fd1010ef-2beb-ed11-8847-6045bd0d6904"
    };
}

public static class Lifts
{
    public static Dictionary<string, string> Ids = new()
    {
        ["evacuation"] = "310e3c9a-57eb-ed11-8847-6045bd0d6904",
        ["firefighters"] = "65d444cb-57eb-ed11-8847-6045bd0d6904",
        ["fire-fighting"] = "967ddde3-57eb-ed11-8847-6045bd0d6904",
        ["modernised"] = "368a4404-58eb-ed11-8847-6045bd0d6904",
        ["firemen"] = "ac73d81c-58eb-ed11-8847-6045bd0d6904",
    };
}

public static class ResidentialAreas
{
    public static Dictionary<string, string> Ids = new()
    {
        ["basement"] = "7113402c-35eb-ed11-8847-6045bd0d6904",
        ["bin_store"] = "31178f39-35eb-ed11-8847-6045bd0d6904",
        ["car_park"] = "e9a5aa45-35eb-ed11-8847-6045bd0d6904",
        ["common_balcony"] = "727ea951-35eb-ed11-8847-6045bd0d6904",
        ["common_corridor"] = "6a53305e-35eb-ed11-8847-6045bd0d6904",
        ["common_staircase"] = "9d2ea870-35eb-ed11-8847-6045bd0d6904",
        ["external_staircase"] = "6c2ccd7c-35eb-ed11-8847-6045bd0d6904",
        ["lobby"] = "564aeb88-35eb-ed11-8847-6045bd0d6904",
        ["share_space_equipment"] = "6db8149b-35eb-ed11-8847-6045bd0d6904",
        ["share_space_no_equipment"] = "56b85ef7-35eb-ed11-8847-6045bd0d6904",
        ["rooftop"] = "b1218e03-36eb-ed11-8847-6045bd0d6904",
        ["other"] = "73a08609-36eb-ed11-8847-6045bd0d6904",
    };
}

public static class Energies
{
    public static Dictionary<string, string> Ids = new()
    {
        // storage
        ["hydrogen_batteries"] = "f4d28f53-3cf3-ed11-8848-6045bd0d6904",
        ["lithium_ion_batteries"] = "888eb25f-3cf3-ed11-8848-6045bd0d6904",
        ["other"] = "b81d1666-3cf3-ed11-8848-6045bd0d6904",
        
        // supply
        ["energy-supply-communal"] = "5311d6a8-3cf3-ed11-8848-6045bd0d6904",
        ["energy-supply-mains-electric"] = "215eeab4-3cf3-ed11-8848-6045bd0d6904",
        ["energy-supply-mains-hydrogen"] = "da689ec1-3cf3-ed11-8848-6045bd0d6904",
        ["energy-supply-mains-gas"] = "7aa3bac7-3cf3-ed11-8848-6045bd0d6904",
        ["energy-supply-oil"] = "0cfdb2cd-3cf3-ed11-8848-6045bd0d6904",
        ["energy-supply-other"] = "516024da-3cf3-ed11-8848-6045bd0d6904",
        
        // onsite
        ["air-ground-source-heat-pumps"] = "b9561d7e-3cf3-ed11-8848-6045bd0d6904",
        ["biomass-boiler"] = "34c31c84-3cf3-ed11-8848-6045bd0d6904",
        ["solar-wind"] = "89731490-3cf3-ed11-8848-6045bd0d6904",
        ["other"] = "7940a79c-3cf3-ed11-8848-6045bd0d6904"
    };
}