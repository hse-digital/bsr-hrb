using System.Globalization;
using HSEPortal.API.Functions;
using HSEPortal.API.Model;
using HSEPortal.Domain.Entities;
using Microsoft.Extensions.Options;

namespace HSEPortal.API.Services;

public class KbiService
{
    private readonly DynamicsService dynamicsService;
    private readonly DynamicsApi dynamicsApi;
    private readonly DynamicsOptions dynamicsOptions;

    public KbiService(DynamicsService dynamicsService, DynamicsApi dynamicsApi, IOptions<DynamicsOptions> dynamicsOptions)
    {
        this.dynamicsService = dynamicsService;
        this.dynamicsApi = dynamicsApi;
        this.dynamicsOptions = dynamicsOptions.Value;
    }

    public async Task<DynamicsStructure> GetDynamicsStructure(string structureName, string postcode, string applicationId)
    {
        var application = await dynamicsService.GetBuildingApplicationUsingId(applicationId);
        return await dynamicsService.FindExistingStructureAsync(structureName, postcode, application.bsr_buildingapplicationid);
    }

    public async Task UpdateKbiStructureStart(KbiSyncData kbiSyncData)
    {
        var structure = new DynamicsStructure { bsr_blockid = kbiSyncData.DynamicsStructure.bsr_blockid };
        if (string.IsNullOrEmpty(kbiSyncData.DynamicsStructure.bsr_kbistartdate))
        {
            structure = structure with { bsr_kbistartdate = DateTime.Now.ToString(CultureInfo.InvariantCulture) };

            var building = await dynamicsApi.Get<DynamicsBuilding>($"bsr_buildings({kbiSyncData.DynamicsStructure._bsr_buildingid_value})");
            building = building with { bsr_kbistartdate = structure.bsr_kbistartdate.ToString(CultureInfo.InvariantCulture) };

            await dynamicsApi.Update($"bsr_blocks({structure.bsr_blockid})", structure);
            await dynamicsApi.Update($"bsr_buildings({building.bsr_buildingid})", building);
        }
    }

    public async Task UpdateSectionFireData(KbiSyncData kbiSyncData)
    {
        var fireData = kbiSyncData.KbiSectionModel.Fire;

        // evacuation policy
        var structure = new DynamicsStructure { bsr_blockid = kbiSyncData.DynamicsStructure.bsr_blockid, bsr_evacuationpolicy_blockid = $"/bsr_evacuationpolicies({DynamicsSectionEvacuation.Ids[fireData.StrategyEvacuateBuilding]})" };

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
            bsr_doorwith120minutecertifiedfireresistance = int.Parse(fireData.FireDoorsCommon.FireDoorHundredTwentyMinute),
            bsr_doorswith30minutescertifiedfireresistance = int.Parse(fireData.FireDoorsCommon.FireDoorThirtyMinute),
            bsr_doorswith60minutescertifiedfireresistance = int.Parse(fireData.FireDoorsCommon.FireDoorSixtyMinute),
            bsr_doorthatcertifiedfireresistanceisnotknown = int.Parse(fireData.FireDoorsCommon.FireDoorUnknown),
            bsr_doorswithnocertifiedfireresistance = int.Parse(fireData.ResidentialUnitFrontDoors.NoFireResistance),
            bsr_doorsthatcertifiedfireresistanceisnotknow = int.Parse(fireData.ResidentialUnitFrontDoors.NotKnownFireResistance),
            bsr_doorswith120minutecertifiedfireresistance = int.Parse(fireData.ResidentialUnitFrontDoors.HundredTwentyMinsFireResistance),
            bsr_doorswith30minutecertifiedfireresistance = int.Parse(fireData.ResidentialUnitFrontDoors.ThirtyMinsFireResistance),
            bsr_doorswith60minutecertifiedfireresistance = int.Parse(fireData.ResidentialUnitFrontDoors.SixtyMinsFireResistance)
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
                structureId = $"/bsr_blocks({structure.bsr_blockid})",
                energyId = $"/bsr_energysupplies({storageId})"
            };

            await CreateStructureEnergyIfNotExists(structure, storageId, dynamicsStructureEnergy);
        }

        foreach (var onsite in energyData.OnsiteEnergyGeneration)
        {
            var onsiteId = Energies.Ids[onsite];
            var dynamicsStructureEnergy = new DynamicsStructureEnergy
            {
                structureId = $"/bsr_blocks({structure.bsr_blockid})",
                energyId = $"/bsr_energysupplies({onsiteId})"
            };

            await CreateStructureEnergyIfNotExists(structure, onsiteId, dynamicsStructureEnergy);
        }

        foreach (var supply in energyData.EnergySupply)
        {
            var supplyId = Energies.Ids[supply];
            var dynamicsStructureEnergy = new DynamicsStructureEnergy
            {
                structureId = $"/bsr_blocks({structure.bsr_blockid})",
                energyId = $"/bsr_energysupplies({supplyId})"
            };

            await CreateStructureEnergyIfNotExists(structure, supplyId, dynamicsStructureEnergy);
        }
    }

    public async Task UpdateSectionStructureData(KbiSyncData kbiSyncData)
    {
        var structureMaterial = new DynamicsStructureMaterial
        {
            structureId = $"/bsr_blocks({kbiSyncData.DynamicsStructure.bsr_blockid})",
        };

        foreach (var material in kbiSyncData.KbiSectionModel.BuildingStructure.BuildingStructureType)
        {
            var materialId = Materials.Ids[material];
            structureMaterial = structureMaterial with
            {
                materialId = $"/bsr_materials({materialId})"
            };

            var records = await dynamicsApi.Get<DynamicsResponse<DynamicsStructureMaterial>>("bsr_structurematerials", ("$filter", $"_bsr_structure_value eq '{kbiSyncData.DynamicsStructure.bsr_blockid}' and bsr_structurematerialid eq '{materialId}'"));
            if (!records.value.Any())
            {
                await dynamicsApi.Create("bsr_structurematerials", structureMaterial);
            }
        }
    }

    public async Task UpdateSectionRoofData(KbiSyncData kbiSyncData)
    {
        var structure = new DynamicsStructure { bsr_blockid = kbiSyncData.DynamicsStructure.bsr_blockid };
        var roof = kbiSyncData.KbiSectionModel.Roof;
        var materialId = Materials.Ids[roof.RoofMaterial];

        structure = structure with
        {
            bsr_typeofroof = RoofStructure.Types[roof.RoofType],
            bsr_roofstructurelayerofinsulation = RoofStructure.Insulation[roof.RoofInsulation],
            primaryRoofMaterialId = $"/bsr_materials({materialId})"
        };

        await dynamicsApi.Update($"bsr_blocks({structure.bsr_blockid})", structure);
    }

    public async Task UpdateSectionStaircasesData(KbiSyncData kbiSyncData)
    {
        var structure = new DynamicsStructure { bsr_blockid = kbiSyncData.DynamicsStructure.bsr_blockid };
        structure = structure with
        {
            bsr_totalnumberofstaircases = int.Parse(kbiSyncData.KbiSectionModel.Staircases.TotalNumberStaircases),
            bsr_numberofinternalstaircasesfromgroundlevel = int.Parse(kbiSyncData.KbiSectionModel.Staircases.InternalStaircasesAllFloors),
        };

        await dynamicsApi.Update($"bsr_blocks({structure.bsr_blockid})", structure);
    }

    public async Task UpdateSectionWallsData(KbiSyncData kbiSyncData)
    {
        var walls = kbiSyncData.KbiSectionModel.Walls;
        var structureMaterial = new DynamicsStructureMaterial
        {
            structureId = $"/bsr_blocks({kbiSyncData.DynamicsStructure.bsr_blockid})",
        };

        foreach (var material in walls.ExternalWallMaterials)
        {
            var materialId = Materials.ExternalWallsIds[material];
            structureMaterial = structureMaterial with
            {
                materialId = $"/bsr_materials({materialId})",
                bsr_percentageofmaterial = int.Parse(walls.ExternalWallMaterialsPercentage[material]),
            };

            if (material == "acm")
            {
                structureMaterial = structureMaterial with
                {
                    bsr_aluminiumcompositematerialacm = Walls.Acm[walls.WallACM]
                };
            }

            if (material == "hpl")
            {
                structureMaterial = structureMaterial with
                {
                    bsr_highpressurelaminatehpl = Walls.Acm[walls.WallHPL]
                };
            }

            var records = await dynamicsApi.Get<DynamicsResponse<DynamicsStructureMaterial>>("bsr_structurematerials", ("$filter", $"_bsr_structure_value eq '{kbiSyncData.DynamicsStructure.bsr_blockid}' and bsr_structurematerialid eq '{materialId}'"));
            if (!records.value.Any())
            {
                await dynamicsApi.Create("bsr_structurematerials", structureMaterial);
            }
        }

        foreach (var insulation in walls.ExternalWallInsulation.CheckBoxSelection)
        {
            var materialId = Materials.InsulationIds[insulation];
            var insulationPercentage = walls.ExternalWallInsulationPercentages.TryGetValue(insulation, out var percentage) ? int.Parse(percentage) : 0;
            structureMaterial = structureMaterial with
            {
                materialId = $"/bsr_materials({materialId})",
                bsr_percentageofmaterial = insulationPercentage,
            };

            if (insulation == "other")
            {
                structureMaterial = structureMaterial with
                {
                    bsr_otherspecifiedmaterial = walls.ExternalWallInsulation.OtherValue
                };
            }

            var records = await dynamicsApi.Get<DynamicsResponse<DynamicsStructureMaterial>>("bsr_structurematerials", ("$filter", $"_bsr_structure_value eq '{kbiSyncData.DynamicsStructure.bsr_blockid}' and bsr_structurematerialid eq '{materialId}'"));
            if (!records.value.Any())
            {
                await dynamicsApi.Create("bsr_structurematerials", structureMaterial);
            }
        }

        foreach (var feature in walls.ExternalFeatures)
        {
            var featureId = Materials.FeatureIds[feature];
            var structureFeature = new DynamicsExternalFeature
            {
                structureId = $"/bsr_blocks({kbiSyncData.DynamicsStructure.bsr_blockid})",
                featureId = $"/bsr_externalfeaturetypes({featureId})"
            };

            foreach (var material in walls.FeatureMaterialsOutside[feature])
            {
                var materialId = Materials.ExternalFeatureIds[material];
                structureFeature = structureFeature with
                {
                    materialId = $"/bsr_materials({materialId})",
                };

                var records = await dynamicsApi.Get<DynamicsResponse<DynamicsExternalFeature>>("bsr_blockexternalfeatures", ("$filter", $"_bsr_blockid_value eq '{kbiSyncData.DynamicsStructure.bsr_blockid}' and _bsr_externalfeaturetypeid_value eq '{featureId}' and _bsr_materialid_value eq '{materialId}'"));
                if (!records.value.Any())
                {
                    await dynamicsApi.Create("bsr_blockexternalfeatures", structureFeature);
                }
            }
        }
    }

    public async Task UpdateSectionBuildingUseData(KbiSyncData kbiSyncData)
    {
        var structure = new DynamicsStructure { bsr_blockid = kbiSyncData.DynamicsStructure.bsr_blockid };
        var building = kbiSyncData.KbiSectionModel.BuildingUse;

        structure = structure with
        {
            primaryUseId = $"/bsr_blockuses({BuildingUse.Uses[building.PrimaryUseOfBuilding]})",
            bsr_numberoffloorsbelowgroundlevel = int.Parse(building.FloorsBelowGroundLevel),
            primaryUseBelowGroundId = $"/bsr_blockuses({BuildingUse.Uses[building.PrimaryUseBuildingBelowGroundLevel]})",
            bsr_differentprimaryuseinthepast = building.ChangePrimaryUse == "yes",
            bsr_changeofuseyearnew = building.YearChangeInUse,
        };

        if (building.ChangePrimaryUse == "yes")
        {
            structure = structure with
            {
                previousUseId = $"/bsr_blockuses({BuildingUse.Uses[building.PreviousUseBuilding]})",
            };
        }

        if (!string.IsNullOrEmpty(building.YearMostRecentMaterialChange))
        {
            structure = structure with
            {
                bsr_yearofmostrecentchangenew = building.YearMostRecentMaterialChange
            };
        }

        if (!string.IsNullOrEmpty(building.MostRecentMaterialChange))
        {
            var workId = BuildingUse.MaterialChanges[building.MostRecentMaterialChange];
            structure = structure with
            {
                recentWorkId = $"/bsr_blockmaterialchanges({workId})"
            }; 
        }

        foreach (var secondaryUse in building.SecondaryUseBuilding)
        {
            var use = BuildingUse.Uses[secondaryUse];
            var records = await dynamicsApi.Get<DynamicsResponse<DynamicsStructureUse>>($"bsr_blockuses({use})/bsr_blockuse_block", ("$filter", $"bsr_blockid eq '{structure.bsr_blockid}'"));
            if (!records.value.Any())
            {
                await dynamicsApi.Create($"bsr_blockuses({use})/bsr_blockuse_block/$ref", new DynamicsStructureUse
                {
                    relationshipId = $"{dynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_blocks({structure.bsr_blockid})"
                });
            }
        }

        foreach (var work in building.UndergoneBuildingMaterialChanges)
        {
            var workId = BuildingUse.MaterialChanges[work];
            var structureWork = new DynamicsStructureWork
            {
                structureId = $"/bsr_blocks({structure.bsr_blockid})",
                workId = $"/bsr_blockmaterialchanges({workId})"
            };

            if (work == "floors_added")
            {
                foreach (var workMaterial in building.AddedFloorsType)
                {
                    var materialId = Materials.Structural[workMaterial];
                    structureWork = structureWork with
                    {
                        materialId = $"/bsr_materials({materialId})"
                    };

                    var records = await dynamicsApi.Get<DynamicsResponse<DynamicsStructureWork>>($"bsr_structurebuildingworks", ("$filter", $"_bsr_buildingwork_value eq '{workId}' and _bsr_structure_value eq '{structure.bsr_blockid}' and _bsr_material_value eq '{materialId}'"));
                    if (!records.value.Any())
                    {
                        await dynamicsApi.Create($"bsr_structurebuildingworks", structureWork);
                    }
                }
            }
            else
            {
                var records = await dynamicsApi.Get<DynamicsResponse<DynamicsStructureWork>>($"bsr_structurebuildingworks", ("$filter", $"_bsr_buildingwork_value eq '{workId}' and _bsr_structure_value eq '{structure.bsr_blockid}'"));
                if (!records.value.Any())
                {
                    await dynamicsApi.Create($"bsr_structurebuildingworks", structureWork);
                }
            }
        }

        await dynamicsApi.Update($"bsr_blocks({structure.bsr_blockid})", structure);
    }

    public async Task UpdateSectionConnectionsData(KbiSyncData kbiSyncData)
    {
        var connections = kbiSyncData.KbiModel.Connections;
        var buildingId = kbiSyncData.DynamicsStructure._bsr_buildingid_value;

        var building = await dynamicsApi.Get<DynamicsBuilding>($"bsr_buildings({buildingId})");
        building = building with
        {
            bsr_connectiontootherhighriseresidentialbuilding = connections.OtherHighRiseBuildingConnections == "yes",
            bsr_connectiontootherbuilding = connections.OtherBuildingConnections == "yes"
        };

        await dynamicsApi.Update($"bsr_buildings({building.bsr_buildingid})", building);

        if (kbiSyncData.KbiModel.KbiSections.Length > 1)
        {
            foreach (var connection in connections.StructureConnections)
            {
                await AddConnectionIfDoesntExist(buildingId, connection, BuildingConnection.Structural);
            }
        }

        if (connections.OtherHighRiseBuildingConnections == "yes")
        {
            foreach (var connection in connections.HowOtherHighRiseBuildingAreConnected)
            {
                await AddConnectionIfDoesntExist(buildingId, connection, BuildingConnection.HighRiseResidentialBuilding);
            }
        }

        if (connections.OtherBuildingConnections == "yes")
        {
            foreach (var connection in connections.HowOtherBuildingAreConnected)
            {
                await AddConnectionIfDoesntExist(buildingId, connection, BuildingConnection.AnotherBuilding);
            }
        }
    }

    private async Task AddConnectionIfDoesntExist(string buildingId, string connection, BuildingConnection buildingConnection)
    {
        var connectionTypeId = BuildingConnections.Ids[connection];
        var connectedStructure = new DynamicsConnectedStructure
        {
            buildingId = $"/bsr_buildings({buildingId})",
            connectionTypeId = $"/bsr_structureconnectiontypes({connectionTypeId})",
            bsr_buildingconnection = (int)buildingConnection
        };

        var records = await dynamicsApi.Get<DynamicsResponse<DynamicsConnectedStructure>>($"bsr_connectedblocks", ("$filter", $"_bsr_structureconnectiontypeid_value eq '{connectionTypeId}' and _bsr_building_value eq '{buildingId}' and bsr_buildingconnection eq {connectedStructure.bsr_buildingconnection}"));
        if (!records.value.Any())
        {
            await dynamicsApi.Create($"bsr_connectedblocks", connectedStructure);
        }
    }

    public async Task UpdateSectionDeclarationData(KbiSyncData kbiSyncData)
    {
        var structure = new DynamicsStructure { bsr_blockid = kbiSyncData.DynamicsStructure.bsr_blockid };
        structure = structure with
        {
            bsr_kbicompletiondate = DateTime.Now.ToString(CultureInfo.InvariantCulture),
            bsr_kbicomplete = true
        };

        var building = await dynamicsApi.Get<DynamicsBuilding>($"bsr_buildings({kbiSyncData.DynamicsStructure._bsr_buildingid_value})");
        building = building with
        {
            bsr_kbicompletiondate = structure.bsr_kbicompletiondate.ToString(CultureInfo.InvariantCulture),
            bsr_kbideclaration = true,
        };

        await dynamicsApi.Update($"bsr_blocks({structure.bsr_blockid})", structure);
        await dynamicsApi.Update($"bsr_buildings({building.bsr_buildingid})", building);
    }

    private async Task GetOrCreateFireOrSmokeProvisions(string blockId, string provision, string[] locations)
    {
        var provisionId = FireSmokeProvision.Ids[provision];
        var record = new DynamicsFireAndSmokeProvisions
        {
            blockId = $"/bsr_blocks({blockId})",
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
                ("$filter", $"_bsr_blockid_value eq '{blockId}' and _bsr_residentialareaid_value eq '{residentialAreaId}' and _bsr_firesmokeprovisionid_value eq '{provisionId}'")
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
                structureId = $"/bsr_blocks({blockId})",
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
        ["fire_extinguishers"] = "63a19a9f-fb08-ee11-8f6e-002248c725da",
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

public static class Materials
{
    public static Dictionary<string, string> Ids = new()
    {
        // structure
        ["composite_steel_concrete"] = "8a4d5b91-81f8-ed11-8f6d-002248c725da",
        ["concrete_large_panels_1960"] = "629f509d-81f8-ed11-8f6d-002248c725da",
        ["concrete_large_panels_1970"] = "91574ba3-81f8-ed11-8f6d-002248c725da",
        ["modular_concrete"] = "910503bc-81f8-ed11-8f6d-002248c725da",
        ["concrete_other"] = "3d4cfbc1-81f8-ed11-8f6d-002248c725da",
        ["lightweight_metal"] = "ae9a2ece-81f8-ed11-8f6d-002248c725da",
        ["Masonry"] = "56f639d4-81f8-ed11-8f6d-002248c725da",
        ["modular_steel"] = "92cd57e0-81f8-ed11-8f6d-002248c725da",
        ["steel_frame"] = "eeff5be6-81f8-ed11-8f6d-002248c725da",
        ["modular_other_metal"] = "6c6cfff2-81f8-ed11-8f6d-002248c725da",
        ["modular_timber"] = "7d6e1dff-81f8-ed11-8f6d-002248c725da",
        ["timber"] = "dc8c2d05-82f8-ed11-8f6d-002248c725da",

        // roof
        ["composite-panels"] = "c7f4b76b-edc7-ed11-b596-6045bd0b96a6",
        ["fibre-cement"] = "2c5b4a6d-29ca-ed11-b595-6045bd0d6939",
        ["metal-sheet"] = "42db49e4-29ca-ed11-b595-6045bd0d6939",
        ["plastic-sheet"] = "ca48572e-2aca-ed11-b595-6045bd0d6939",
        ["polycarbonate-sheet"] = "ab484a4d-2aca-ed11-b595-6045bd0d6939",
        ["other-sheet-material"] = "acb5c788-18f0-ed11-8848-6045bd0d6904",
        ["rolled-liquid-bitumen-felt"] = "8fd237e0-18f0-ed11-8848-6045bd0d6904",
        ["rolled-liquid-other-felt"] = "89107c04-19f0-ed11-8848-6045bd0d6904",
        ["rolled-liquid-rubber"] = "b2708b29-19f0-ed11-8848-6045bd0d6904",
        ["rolled-liquid-hot-cold-roof"] = "d83aaf42-1af0-ed11-8848-6045bd0d6904",
        ["raac"] = "65f842ce-25f0-ed11-8848-6045bd0d6904",
        ["shingles"] = "05a89665-2aca-ed11-b595-6045bd0d6939",
        ["slate"] = "4cafd16b-2aca-ed11-b595-6045bd0d6939",
        ["tiles"] = "1753ea7e-2aca-ed11-b595-6045bd0d6939",
        ["green-roof"] = "31c48b8c-29ca-ed11-b595-6045bd0d6939",

        ["none"] = "38d6adc2-14f3-ed11-8848-6045bd0d6610"
    };

    public static Dictionary<string, string> ExternalWallsIds = new()
    {
        ["acm"] = "a3769c0a-baf8-ed11-8f6d-002248c725da",
        ["hpl"] = "379e312a-baf8-ed11-8f6d-002248c725da",
        ["metal-composite-panels"] = "2497c542-baf8-ed11-8f6d-002248c725da",
        ["other-composite-panels"] = "7d1ce14e-baf8-ed11-8f6d-002248c725da",
        ["concrete"] = "08b85661-baf8-ed11-8f6d-002248c725da",
        ["green-walls"] = "8e6bc073-baf8-ed11-8f6d-002248c725da",
        ["masonry"] = "c401158e-baf8-ed11-8f6d-002248c725da",
        ["metal-panels"] = "71312dac-baf8-ed11-8f6d-002248c725da",
        ["render"] = "7ac8cbb8-baf8-ed11-8f6d-002248c725da",
        ["tiles"] = "5aef06bf-baf8-ed11-8f6d-002248c725da",
        ["timber"] = "50f018cb-baf8-ed11-8f6d-002248c725da",
        ["glass"] = "4298a967-baf8-ed11-8f6d-002248c725da",
        ["other"] = "120469d7-baf8-ed11-8f6d-002248c725da",
    };

    public static Dictionary<string, string> InsulationIds = new()
    {
        ["fibre_glass_mineral_wool"] = "0f2cecca-77f9-ed11-8f6d-002248c725da",
        ["fibre_wood_sheep_wool"] = "24e217dd-77f9-ed11-8f6d-002248c725da",
        ["foil_bubble_multifoil_insulation"] = "4ef620fb-77f9-ed11-8f6d-002248c725da",
        ["phenolic_foam"] = "36720913-78f9-ed11-8f6d-002248c725da",
        ["eps_xps"] = "2a8cb865-78f9-ed11-8f6d-002248c725da",
        ["other"] = "10bd88b6-78f9-ed11-8f6d-002248c725da",
        ["pur_pir_iso"] = "1a5717aa-78f9-ed11-8f6d-002248c725da",
        ["none"] = "cd4314c3-78f9-ed11-8f6d-002248c725da"
    };

    public static Dictionary<string, string> FeatureIds = new()
    {
        ["advertising"] = "9ae12433-83f9-ed11-8f6d-002248c725da",
        ["balconies"] = "d9072739-83f9-ed11-8f6d-002248c725da",
        ["communal_recreation_area"] = "967cc34d-83f9-ed11-8f6d-002248c725da",
        ["communal_walkway"] = "bdc8cb64-83f9-ed11-8f6d-002248c725da",
        ["escape_route_roof"] = "88c56777-83f9-ed11-8f6d-002248c725da",
        ["external_staircases"] = "953e7c83-83f9-ed11-8f6d-002248c725da",
        ["machinery_outbuilding"] = "9407d036-84f9-ed11-8f6d-002248c725da",
        ["machinery_roof_room"] = "dd7485a4-83f9-ed11-8f6d-002248c725da",
        ["machinery_roof"] = "b244767b-84f9-ed11-8f6d-002248c725da",
        ["phone_masts"] = "0dba7e87-84f9-ed11-8f6d-002248c725da",
        ["roof_lights"] = "549dbe8d-84f9-ed11-8f6d-002248c725da",
        ["solar_shading"] = "ed64c999-84f9-ed11-8f6d-002248c725da",
        ["other"] = "ed1c34a0-84f9-ed11-8f6d-002248c725da",
        ["none"] = "5acd930d-83f9-ed11-8f6d-002248c725da",
    };

    public static Dictionary<string, string> ExternalFeatureIds = new()
    {
        ["aluminium"] = "0fabdd5f-7cf9-ed11-8f6d-002248c725da",
        ["concrete"] = "59a7117e-7cf9-ed11-8f6d-002248c725da",
        ["glass"] = "9a111486-7cf9-ed11-8f6d-002248c725da",
        ["masonry"] = "16a3da98-7cf9-ed11-8f6d-002248c725da",
        ["metal"] = "5074dc9e-7cf9-ed11-8f6d-002248c725da",
        ["plastic"] = "45ab49bd-7cf9-ed11-8f6d-002248c725da",
        ["slate"] = "0c0ef3d5-7cf9-ed11-8f6d-002248c725da",
        ["timber"] = "d4d647e2-7cf9-ed11-8f6d-002248c725da",
        ["other"] = "e6e244e8-7cf9-ed11-8f6d-002248c725da",
    };

    public static Dictionary<string, string> Structural = new()
    {
        ["composite_steel_concrete"] = "8a4d5b91-81f8-ed11-8f6d-002248c725da",
        ["concrete_large_panels_1960"] = "629f509d-81f8-ed11-8f6d-002248c725da",
        ["concrete_large_panels_1970"] = "91574ba3-81f8-ed11-8f6d-002248c725da",
        ["modular_concrete"] = "910503bc-81f8-ed11-8f6d-002248c725da",
        ["concrete_other"] = "3d4cfbc1-81f8-ed11-8f6d-002248c725da",
        ["lightweight_metal"] = "ae9a2ece-81f8-ed11-8f6d-002248c725da",
        ["Masonry"] = "56f639d4-81f8-ed11-8f6d-002248c725da",
        ["modular_steel"] = "92cd57e0-81f8-ed11-8f6d-002248c725da",
        ["steel_frame"] = "eeff5be6-81f8-ed11-8f6d-002248c725da",
        ["modular_other_metal"] = "6c6cfff2-81f8-ed11-8f6d-002248c725da",
        ["modular_timber"] = "7d6e1dff-81f8-ed11-8f6d-002248c725da",
        ["timber"] = "dc8c2d05-82f8-ed11-8f6d-002248c725da",
        ["none"] = "38d6adc2-14f3-ed11-8848-6045bd0d6610"
    };
}

public static class RoofStructure
{
    public static Dictionary<string, int> Types = new()
    {
        ["flat-roof"] = 760_810_000,
        ["pitched-roof"] = 760_810_001,
        ["mix-flat-pitched"] = 760_810_002
    };

    public static Dictionary<string, int> Insulation = new()
    {
        ["yes-top"] = 760_810_000,
        ["yes-below"] = 760_810_001,
        ["no"] = 760_810_002
    };
}

public static class Walls
{
    public static Dictionary<string, int> Acm = new()
    {
        ["fire-classification"] = 760_810_000,
        ["large-scale-fire-test"] = 760_810_001,
        ["neither-these"] = 760_810_002,
    };
}

public static class BuildingUse
{
    public static Dictionary<string, string> Uses = new()
    {
        ["assembly_recreation"] = "91b93aec-f4fa-ed11-8f6d-002248c725da",
        ["assembly_and_recreation"] = "91b93aec-f4fa-ed11-8f6d-002248c725da",
        ["office"] = "38c599a8-f5fa-ed11-8f6d-002248c725da",
        ["residential_dwellings"] = "45b94422-f7fa-ed11-8f6d-002248c725da",
        ["residential_institution"] = "9dff16b5-f5fa-ed11-8f6d-002248c725da",
        ["other_residential_use"] = "913ec607-f6fa-ed11-8f6d-002248c725da",
        ["shop_commercial"] = "bb5a8e49-f6fa-ed11-8f6d-002248c725da",
        ["shop_and_commercial"] = "bb5a8e49-f6fa-ed11-8f6d-002248c725da",
        ["other_non_residential"] = "2359b47a-f6fa-ed11-8f6d-002248c725da",
        [""] = "ad72a7b8-f8fa-ed11-8f6d-002248c725da"
    };

    public static Dictionary<string, string> MaterialChanges = new()
    {
        ["asbestos_removal"] = "42928b0d-04fb-ed11-8f6d-002248c725da",
        ["balconies_added"] = "dec8b41f-04fb-ed11-8f6d-002248c725da",
        ["changes_residential_units"] = "fb0d0d33-04fb-ed11-8f6d-002248c725da",
        ["changes_staircase_cores"] = "203fd551-04fb-ed11-8f6d-002248c725da",
        ["changes_windows"] = "d3a5835f-04fb-ed11-8f6d-002248c725da",
        ["complete_rewiring"] = "ac467284-04fb-ed11-8f6d-002248c725da",
        ["floors_added"] = "e0444241-05fb-ed11-8f6d-002248c725da",
        ["floors_removed"] = "c694754d-05fb-ed11-8f6d-002248c725da",
        ["installation_replacement_removal_fire_systems"] = "77214267-07fb-ed11-8f6d-002248c725da",
        ["installation_replacement_removal_lighting"] = "c6b0c186-07fb-ed11-8f6d-002248c725da",
        ["installation_replacement_removal_cold_water_systems"] = "8e2f4ec5-07fb-ed11-8f6d-002248c725da",
        ["installation_replacement_removal_gas_supply"] = "c0887822-08fb-ed11-8f6d-002248c725da",
        ["reinforcement_works_large_panel_system"] = "217dfa41-08fb-ed11-8f6d-002248c725da",
        ["work_external_walls"] = "e97d98c3-08fb-ed11-8f6d-002248c725da",
        ["none"] = "995433ca-03fb-ed11-8f6d-002248c725da",
        ["unknown"] = "b6edcc0b-0efb-ed11-8f6d-002248c725da"
    };
}

public static class BuildingConnections
{
    public static Dictionary<string, string> Ids = new()
    {
        ["bridge-walkway"] = "554316de-cdfb-ed11-8f6d-002248c725da",
        ["car-park"] = "70c776fd-cdfb-ed11-8f6d-002248c725da",
        ["ground-floor"] = "c856e00a-cefb-ed11-8f6d-002248c725da",
        ["levels-below-ground-residential-unit"] = "8ce79549-cefb-ed11-8f6d-002248c725da",
        ["levels-below-ground-no-residential-unit"] = "f537f163-cefb-ed11-8f6d-002248c725da",
        ["shared-wall-emergency-door"] = "b8292476-cefb-ed11-8f6d-002248c725da",
        ["shared-wall-everyday-door"] = "6d7b4495-cefb-ed11-8f6d-002248c725da",
        ["shared-wall-no-door"] = "738887ad-cefb-ed11-8f6d-002248c725da",
        ["other"] = "d3a5b6b3-cefb-ed11-8f6d-002248c725da"
    };
}

public enum BuildingConnection
{
    Structural = 760_810_000,
    HighRiseResidentialBuilding = 760_810_001,
    AnotherBuilding = 760_810_002
}