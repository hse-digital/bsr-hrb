import { ApplicationService, BuildingStructure, Fire, KbiSectionModel, SectionModel, Status } from "src/app/services/application.service";
import { ChangeHelper, ChangedAnswersModel } from "./change-helper";

export class ChangeKbiHelper extends ChangeHelper {

    mapper: KbiTextMappers = new KbiTextMappers();

    constructor(private applicationService: ApplicationService) {
        super();
    }

    getChanges(): ChangedAnswersModel[] {
        let previousVersion = this.applicationService.previousVersion;
        let changes: ChangedAnswersModel[] = this.applicationService.currentVersion.Kbi?.KbiSections?.flatMap((section, index) => {
            if (section.Status == Status.Removed) return undefined;
            let originalSection = (previousVersion?.Kbi?.KbiSections?.length ?? 0) <= index ? new KbiSectionModel() : previousVersion!.Kbi!.KbiSections[index];
            return this.getKbiChanges(originalSection, section, index);
        }).filter(x => !!x).map(x => x!) ?? [];
        return changes;
    }

    getChangesOf(section: KbiSectionModel, index: number) {
        let previousVersion = this.applicationService.previousVersion;
        if (section?.Status == Status.Removed) return undefined;
        let originalSection = (previousVersion?.Kbi?.KbiSections?.length ?? 0) <= index ? new KbiSectionModel() : previousVersion!.Kbi!.KbiSections[index];
        return this.getKbiChanges(originalSection, section, index).filter(x => !!x).map(x => x!);
    }

    getKbiChanges(original: KbiSectionModel, current: KbiSectionModel, index: number): ChangedAnswersModel[] {
        let sectionName = this.getLatestValueOf(original.StructureName, current.StructureName) ?? this.applicationService.model.BuildingName!;

        let changes: (ChangedAnswersModel | undefined)[] = [];
        changes.push(...this.getFireChanges(original, current, index, sectionName));
        changes.push(...this.getEnergyChanges(original, current, index, sectionName));
        changes.push(...this.getStructureChanges(original, current, index, sectionName));
        changes.push(...this.getRoofChanges(original, current, index, sectionName));
        changes.push(...this.getStaircasesChanges(original, current, index, sectionName));
        changes.push(...this.getWallsChanges(original, current, index, sectionName));
        changes.push(...this.getBuildingUseChanges(original, current, index, sectionName));

        return changes.filter(x => !!x && x != undefined).map(x => x!);
    }

    private getFireChanges(original: KbiSectionModel, current: KbiSectionModel, index: number, sectionName: string) {
        let groupName = "fire/";
        let changes: (ChangedAnswersModel | undefined)[] = [];
        changes.push(this.getFieldChange(this.mapper.getEvacuationType(original.Fire.StrategyEvacuateBuilding!), this.mapper.getEvacuationType(current.Fire.StrategyEvacuateBuilding!), "Evacuation strategy", "Evacuation strategy", groupName + "evacuation-strategy", sectionName, index));

        changes.push(this.getResidentialFrontDoorsChanges(original, current, index, sectionName));

        changes.push(this.getFireDoorsCommonChanges(original, current, index, sectionName));

        changes.push(this.getFieldChange(this.mapper.getLiftTypes(original.Fire.Lifts!), this.mapper.getLiftTypes(current.Fire.Lifts!), "Types of lift", "Types of lift", groupName + "lifts", sectionName, index));

        changes.push(this.getFieldChange(this.mapper.getProvisionEquipment(original.Fire.ProvisionsEquipment!), this.mapper.getProvisionEquipment(current.Fire.ProvisionsEquipment!), "Smoke controls in residential parts", "Smoke controls in residential parts", groupName + "provisions-equipment", sectionName, index));

        changes.push(this.getFieldChange(this.mapper.getEquipmentName(original.Fire.FireSmokeProvisions!), this.mapper.getEquipmentName(current.Fire.FireSmokeProvisions!), "Smoke controls in common parts", "Smoke controls in common parts", groupName + "smoke-provisions", sectionName, index));

        changes.push(...this.getSmokeAndFireDeviceLocationsChanges(original, current, index, sectionName));

        return changes;
    }

    private getResidentialFrontDoorsChanges(original: KbiSectionModel, current: KbiSectionModel, index: number, sectionName: string) {
        let originalDoors = original.Fire.ResidentialUnitFrontDoors;
        let currentDoors = current.Fire.ResidentialUnitFrontDoors;
        let originalAnswer = [];
        let currentAnswer = [];

        let formatAnswer = (answer?: any, text?: string) => { return answer != undefined ? `${answer} ${text}` : undefined };

        if (this.hasChanged(originalDoors?.HundredTwentyMinsFireResistance, currentDoors?.HundredTwentyMinsFireResistance)) {
            originalAnswer.push(formatAnswer(originalDoors?.HundredTwentyMinsFireResistance, "doors with 120-minute fire resistance"));
            currentAnswer.push(formatAnswer(currentDoors?.HundredTwentyMinsFireResistance, "doors with 120-minute fire resistance"));
        }
        if (this.hasChanged(originalDoors?.SixtyMinsFireResistance, currentDoors?.SixtyMinsFireResistance)) {
            originalAnswer.push(formatAnswer(originalDoors?.SixtyMinsFireResistance, "doors with 60-minute fire resistance"));
            currentAnswer.push(formatAnswer(currentDoors?.SixtyMinsFireResistance, "doors with 60-minute fire resistance"));
        }
        if (this.hasChanged(originalDoors?.ThirtyMinsFireResistance, currentDoors?.ThirtyMinsFireResistance)) {
            originalAnswer.push(formatAnswer(originalDoors?.ThirtyMinsFireResistance, "doors with 30-minute fire resistance"));
            currentAnswer.push(formatAnswer(currentDoors?.ThirtyMinsFireResistance, "doors with 30-minute fire resistance"));
        }
        if (this.hasChanged(originalDoors?.NoFireResistance, currentDoors?.NoFireResistance)) {
            originalAnswer.push(formatAnswer(originalDoors?.NoFireResistance, "doors with no fire resistance"));
            currentAnswer.push(formatAnswer(currentDoors?.NoFireResistance, "doors with no fire resistance"));
        }
        if (this.hasChanged(originalDoors?.NotKnownFireResistance, currentDoors?.NotKnownFireResistance)) {
            originalAnswer.push(formatAnswer(originalDoors?.NotKnownFireResistance, "doors that fire resistance is not known"));
            currentAnswer.push(formatAnswer(currentDoors?.NotKnownFireResistance, "doors that fire resistance is not known"));
        }
        return originalAnswer.length > 0 ? this.getFieldChange(originalAnswer, currentAnswer, "Residential front doors", "Residential front doors", "fire/residential-unit-front-doors-fire-resistance", sectionName, index) : undefined;
    }

    private getFireDoorsCommonChanges(original: KbiSectionModel, current: KbiSectionModel, index: number, sectionName: string) {
        let originalDoors = original.Fire.FireDoorsCommon;
        let currentDoors = current.Fire.FireDoorsCommon;
        let originalAnswer = [];
        let currentAnswer = [];

        let formatAnswer = (answer?: any, text?: string) => { return answer != undefined ? `${answer} ${text}` : undefined };

        if (this.hasChanged(originalDoors?.FireDoorHundredTwentyMinute, currentDoors?.FireDoorHundredTwentyMinute)) {
            originalAnswer.push(formatAnswer(originalDoors?.FireDoorHundredTwentyMinute, "doors with 120-minute fire resistance"));
            currentAnswer.push(formatAnswer(currentDoors?.FireDoorHundredTwentyMinute, "doors with 120-minute fire resistance"));
        }
        if (this.hasChanged(originalDoors?.FireDoorSixtyMinute, currentDoors?.FireDoorSixtyMinute)) {
            originalAnswer.push(formatAnswer(originalDoors?.FireDoorSixtyMinute, "doors with 60-minute fire resistance"));
            currentAnswer.push(formatAnswer(currentDoors?.FireDoorSixtyMinute, "doors with 60-minute fire resistance"));
        }
        if (this.hasChanged(originalDoors?.FireDoorThirtyMinute, currentDoors?.FireDoorThirtyMinute)) {
            originalAnswer.push(formatAnswer(originalDoors?.FireDoorThirtyMinute, "doors with 30-minute fire resistance"));
            currentAnswer.push(formatAnswer(currentDoors?.FireDoorThirtyMinute, "doors with 30-minute fire resistance"));
        }
        if (this.hasChanged(originalDoors?.FireDoorUnknown, currentDoors?.FireDoorUnknown)) {
            originalAnswer.push(formatAnswer(originalDoors?.FireDoorUnknown, "doors that fire resistance is not known"));
            currentAnswer.push(formatAnswer(currentDoors?.FireDoorUnknown, "doors that fire resistance is not known"));
        }
        return originalAnswer.length > 0 ? this.getFieldChange(originalAnswer, currentAnswer, "Fire doors in common parts", "Fire doors in common parts", "fire/doors-common", sectionName, index) : undefined;
    }

    private getSmokeAndFireDeviceLocationsChanges(original: KbiSectionModel, current: KbiSectionModel, index: number, sectionName: string) {
        let changes: (ChangedAnswersModel | undefined)[] = [];
        if (!current?.Fire?.FireSmokeProvisionLocations || !original.Fire.FireSmokeProvisionLocations) return [];
        for (let device of Object.keys(current.Fire.FireSmokeProvisionLocations)) {
            let deviceName = this.mapper.getEquipmentName([device])[0];
            let originalAnswer = this.mapper.getSmokeAndFireDeviceLocations(device, original.Fire.FireSmokeProvisionLocations);
            let currentAnswer = this.mapper.getSmokeAndFireDeviceLocations(device, current.Fire.FireSmokeProvisionLocations);
            if (this.hasChanged(originalAnswer, currentAnswer)) {
                changes.push(this.getFieldChange(originalAnswer, currentAnswer, "Smoke and Fire device locations - " + deviceName, deviceName, "fire/smoke-provision-locations", sectionName, index));
            }
        }
        return changes;
    }

    private getEnergyChanges(original: KbiSectionModel, current: KbiSectionModel, index: number, sectionName: string) {
        let groupName = "energy/";
        let changes: (ChangedAnswersModel | undefined)[] = [];

        changes.push(this.getFieldChange(this.mapper.getEnergyStorageName(original.Energy.EnergyTypeStorage!), this.mapper.getEnergyStorageName(current.Energy.EnergyTypeStorage!), "Energy Storage", "Energy Storage", groupName + "type", sectionName, index));
        changes.push(this.getFieldChange(this.mapper.getOnSiteGenerationName(original.Energy.OnsiteEnergyGeneration!), this.mapper.getOnSiteGenerationName(current.Energy.OnsiteEnergyGeneration!), "On site generation", "On site generation", groupName + "onsite-generation", sectionName, index));
        changes.push(this.getFieldChange(this.mapper.getEnergySupplyName(original.Energy.EnergySupply!), this.mapper.getEnergySupplyName(current.Energy.EnergySupply!), "Energy supplies", "Energy supplies", groupName + "supply", sectionName, index));

        return changes;
    }

    private getStructureChanges(original: KbiSectionModel, current: KbiSectionModel, index: number, sectionName: string) {
        let groupName = "structure/";
        let changes: (ChangedAnswersModel | undefined)[] = [];

        changes.push(this.getFieldChange(this.mapper.getNonModularMaterials(original.BuildingStructure), this.mapper.getNonModularMaterials(current.BuildingStructure), "Structure Type", "Structure Type", groupName + "building-structure-type", sectionName, index));
        changes.push(this.getFieldChange(this.mapper.getModularMaterials(original.BuildingStructure), this.mapper.getModularMaterials(current.BuildingStructure), "Modular Materials", "Modular Materials", groupName + "building-structure-type", sectionName, index));

        return changes;
    }

    private getRoofChanges(original: KbiSectionModel, current: KbiSectionModel, index: number, sectionName: string) {
        let groupName = "roof/";
        let changes: (ChangedAnswersModel | undefined)[] = [];

        changes.push(this.getFieldChange(this.mapper.getRoofType(original.Roof.RoofType!), this.mapper.getRoofType(current.Roof.RoofType!), "Type of roof surface", "Type of roof surface", groupName + "roof-type", sectionName, index));
        changes.push(this.getFieldChange(this.mapper.getRoofInsulation(original.Roof.RoofInsulation!), this.mapper.getRoofInsulation(current.Roof.RoofInsulation!), "Roof insulation layer", "Roof insulation layer", groupName + "roof-insulation", sectionName, index));
        changes.push(this.getFieldChange(this.mapper.getRoofMaterial(original.Roof.RoofMaterial!), this.mapper.getRoofMaterial(current.Roof.RoofMaterial!), "Main roof material", "Main roof material", groupName + "roof-material", sectionName, index));

        return changes;
    }

    private getStaircasesChanges(original: KbiSectionModel, current: KbiSectionModel, index: number, sectionName: string) {
        let groupName = "staircases/";
        let changes: (ChangedAnswersModel | undefined)[] = [];

        changes.push(this.getFieldChange(original.Staircases.TotalNumberStaircases, current.Staircases.TotalNumberStaircases, "Total staircases", "Total staircases", groupName + "total", sectionName, index));
        changes.push(this.getFieldChange(original.Staircases.InternalStaircasesAllFloors, current.Staircases.InternalStaircasesAllFloors, "Interior from ground floor", "Interior from ground floor", groupName + "total", sectionName, index));

        return changes;
    }

    private getWallsChanges(original: KbiSectionModel, current: KbiSectionModel, index: number, sectionName: string) {
        let groupName = "walls/";
        let changes: (ChangedAnswersModel | undefined)[] = [];

        changes.push(this.getFieldChange(this.mapper.getExternalWallMaterialName(original.Walls.ExternalWallMaterials!), this.mapper.getExternalWallMaterialName(current.Walls.ExternalWallMaterials!), "External wall materials", "External wall materials", groupName + "external-materials", sectionName, index));
        changes.push(this.getFieldChange(this.mapper.getACMFireTests(original.Walls.WallACM!), this.mapper.getACMFireTests(current.Walls.WallACM!), "ACM fire tests", "ACM fire tests", groupName + "acm", sectionName, index));
        changes.push(this.getFieldChange(this.mapper.getHPLFireTests(original.Walls.WallHPL!), this.mapper.getHPLFireTests(current.Walls.WallHPL!), "HPL fire tests", "HPL fire tests", groupName + "hpl", sectionName, index));
        changes.push(this.getFieldChange(this.mapper.getExternalWallMaterialNameWithPercentage(original.Walls.ExternalWallMaterials!, original.Walls.ExternalWallMaterialsPercentage!), this.mapper.getExternalWallMaterialNameWithPercentage(current.Walls.ExternalWallMaterials!, current.Walls.ExternalWallMaterialsPercentage!), "Percentage coverage", "Percentage coverage", groupName + "estimated-percentage", sectionName, index));
        changes.push(this.getFieldChange(this.mapper.getInsulationName(original.Walls.ExternalWallInsulation!), this.mapper.getInsulationName(current.Walls.ExternalWallInsulation!), "Outside walls insulation type", "Outside walls insulation type", groupName + "external-insulation-type", sectionName, index));
        changes.push(this.getFieldChange(this.mapper.getInsulationNameWithPercentage(original.Walls.ExternalWallInsulation!, original.Walls.ExternalWallInsulationPercentages!), this.mapper.getInsulationNameWithPercentage(current.Walls.ExternalWallInsulation!, current.Walls.ExternalWallInsulationPercentages!), "Percentage coverage", "Percentage coverage", groupName + "external-insulation-percentage", sectionName, index));

        changes.push(this.getFieldChange(this.mapper.getExternalFeature(original.Walls.ExternalFeatures!), this.mapper.getExternalFeature(current.Walls.ExternalFeatures!), "Attached features", "Attached features", groupName + "external-features", sectionName, index));

        changes.push(...this.getExternalFeatureMaterials(original, current, index, sectionName));

        return changes;
    }

    private getExternalFeatureMaterials(original: KbiSectionModel, current: KbiSectionModel, index: number, sectionName: string) {
        let changes: (ChangedAnswersModel | undefined)[] = [];

        let originalExternalFeatures = original.Walls.ExternalFeatures;
        let originalType = this.mapper.getAvailableFeatures(originalExternalFeatures!);
        let originalNames: Record<string, string[]> = {};
        for (let type of originalType) {
            originalNames[type] = this.mapper.getExternalFeatureMaterialName(this.mapper.getMaterials(type, original.Walls.FeatureMaterialsOutside!));
        }

        let currentExternalFeatures = current.Walls.ExternalFeatures;
        let currentType = this.mapper.getAvailableFeatures(currentExternalFeatures!);
        let currentNames: Record<string, string[]> = {};
        for (let type of currentType) {
            currentNames[type] = this.mapper.getExternalFeatureMaterialName(this.mapper.getMaterials(type, current.Walls.FeatureMaterialsOutside!));
        }

        for (let key of Object.keys(currentNames)) {
            let keyName = this.mapper.getFeatureName(key);
            changes.push(this.getFieldChange(originalNames[key] ?? ["None"], currentNames[key], keyName, keyName, "walls/external-feature-materials", sectionName, index))
        }

        return changes;
    }

    private getBuildingUseChanges(original: KbiSectionModel, current: KbiSectionModel, index: number, sectionName: string) {
        let groupName = "building/";
        let changes: (ChangedAnswersModel | undefined)[] = [];

        changes.push(this.getFieldChange(this.mapper.getBuildingUse([original.BuildingUse.PrimaryUseOfBuilding!]), this.mapper.getBuildingUse([current.BuildingUse.PrimaryUseOfBuilding!]), "Primary use", "Primary use", groupName + "primary-use-of-building", sectionName, index));
        changes.push(this.getFieldChange(this.mapper.getBuildingUse(original.BuildingUse.SecondaryUseBuilding!), this.mapper.getBuildingUse(current.BuildingUse.SecondaryUseBuilding!), "Secondary uses", "Secondary uses", groupName + "secondary-uses", sectionName, index));
        changes.push(this.getFieldChange(original.BuildingUse.FloorsBelowGroundLevel, current.BuildingUse.FloorsBelowGroundLevel, "Number of floors below ground level", "Number of floors below ground level", groupName + "floors-below-ground-level", sectionName, index));
        changes.push(this.getFieldChange(this.mapper.getBuildingUse([original.BuildingUse.PrimaryUseBuildingBelowGroundLevel!]), this.mapper.getBuildingUse([current.BuildingUse.PrimaryUseBuildingBelowGroundLevel!]), "Primary use of floors below ground level", "Primary use of floors below ground level", groupName + "primary-use-floors-below-ground-level", sectionName, index));
        changes.push(this.getFieldChange(original.BuildingUse.ChangePrimaryUse, current.BuildingUse.ChangePrimaryUse, "Change of use", "Change of use", groupName + "change-primary-use", sectionName, index));
        if (current.BuildingUse.ChangePrimaryUse === 'yes') {
            changes.push(this.getFieldChange(this.mapper.getBuildingUse([original.BuildingUse.PreviousUseBuilding!]), this.mapper.getBuildingUse([current.BuildingUse.PreviousUseBuilding!]), "Previous primary use", "Previous primary use", groupName + "previous-primary-use", sectionName, index));
            changes.push(this.getFieldChange(original.BuildingUse.YearChangeInUse, current.BuildingUse.YearChangeInUse, "Year of change of use", "Year of change of use", groupName + "year-change-use", sectionName, index));
        } else {
            changes.push(this.getFieldChange(this.mapper.getBuildingWorksName(original.BuildingUse.UndergoneBuildingMaterialChanges!), this.mapper.getBuildingWorksName(current.BuildingUse.UndergoneBuildingMaterialChanges!), "Building works", "Building works", groupName + "undergone-building-material-changes", sectionName, index));
            changes.push(this.getFieldChange(this.mapper.getMaterialNames(original.BuildingUse.AddedFloorsType!), this.mapper.getMaterialNames(current.BuildingUse.AddedFloorsType!), "Structure type of added floors", "Structure type of added floors", groupName + "added-floors-type", sectionName, index));
            changes.push(this.getFieldChange(this.mapper.getBuildingWorksName([original.BuildingUse.MostRecentMaterialChange!]), this.mapper.getBuildingWorksName([current.BuildingUse.MostRecentMaterialChange!]), "Most recent building work", "Most recent building work", groupName + "most-recent-material-change", sectionName, index));
            changes.push(this.getFieldChange(original.BuildingUse.YearMostRecentMaterialChange, current.BuildingUse.YearMostRecentMaterialChange, "Year of most recent building work", "Year of most recent building work", groupName + "year-most-recent-change", sectionName, index));
        }

        return changes;
    }

}

export class KbiTextMappers {
    private provisionEquipment: Record<string, string> = {
        "heat_detectors": "Heat detectors",
        "smoke_detectors": "Smoke detectors",
        "sprinklers": "Sprinklers or misters",
        "none": "None"
    }
    getProvisionEquipment(names: string[]) {
        return names?.map(x => this.provisionEquipment[x]) ?? [];
    }

    private equipmentNameMapper: Record<string, string> = {
        "alarm_heat_smoke": "Alarm sounders (connected to detectors)",
        "alarm_call_points": "Alarm sounders (connected to call points)",
        "fire_dampers": "Fire dampers",
        "fire_extinguishers": "Fire extinguishers",
        "fire_shutters": "Fire shutters",
        "heat_detectors": "Heat detectors",
        "risers_dry": "Risers dry",
        "risers_wet": "Risers wet",
        "smoke_aovs": "Automatic smoke control systems",
        "smoke_manual": "Manual smoke control systems",
        "smoke_detectors": "Smoke detectors",
        "sprinklers_misters": "Sprinklers and misters",
        "none": "None"
    }
    getEquipmentName(equipment: string[]) {
        return equipment?.map(x => this.equipmentNameMapper[x]) ?? [];
    }

    private evacuationTypeMapper: Record<string, string> = {
        "phased": "Phased",
        "progressive_horizontal": "Progressive horizontal",
        "simultaneous": "Simultaneous",
        "stay_put": "Stay put (defend in place)",
        "temporary_simultaneous": "Temporary simultaneous",
        "none": "None"
    }
    getEvacuationType(evacuationType: string) {
        return this.evacuationTypeMapper[evacuationType];
    }

    private locationNameMapper: Record<string, string> = {
        "basement": "Basement",
        "bin_store": "Bin store",
        "car_park": "Car park",
        "common_balcony": "Common balcony",
        "common_corridor": "Common corridor",
        "common_staircase": "Common staircase",
        "external_staircase": "External staircase",
        "lobby": "Lobby",
        "share_space_equipment": "Shared space with equipment",
        "share_space_no_equipment": "Shared space with no equipment",
        "rooftop": "Rooftop",
        "other": "Other",
        "none": "None"
    }
    getLocationName(locations: string[]) {
        return locations?.map(x => this.locationNameMapper[x]) ?? [];
    }

    getSmokeAndFireDeviceLocations(device: string, FireSmokeProvisionLocations: Record<string, string[]>) {
        if (!!FireSmokeProvisionLocations && Object.keys(FireSmokeProvisionLocations).includes(device)) {
            return this.getLocationName(FireSmokeProvisionLocations[device]);
        }
        else {
            return ["None"]
        }
    }

    private LiftTypeMapper: Record<string, string> = {
        "evacuation": "Evacuation lift",
        "firefighters": "Firefighters lift",
        "fire-fighting": "Fire-fighting lift",
        "modernised": "Modernised lift for fire service use",
        "firemen": "Firemen's lift",
        "none": "None"
    }
    getLiftTypeName(liftTYpe: string) {
        return this.LiftTypeMapper[liftTYpe];
    }

    getLiftTypes(lifts: string[]) {

        if (lifts) {
            return lifts.map(lift => this.getLiftTypeName(lift));
        }
        else {
            return ["No lifts"]
        }
    }

    private energyStorageMapper: Record<string, string> = {
        "hydrogen_batteries": "Hydrogen batteries",
        "lithium_ion_batteries": "Lithium ion batteries",
        "other": "Other",
        "none": "None"
    }
    getEnergyStorageName(names: string[]) {
        return names?.map(x => this.energyStorageMapper[x]) ?? [];
    }

    private onSiteGenerationMapper: Record<string, string> = {
        "air-ground-source-heat-pumps": "Air or ground source heat pumps",
        "biomass-boiler": "Biomass boiler",
        "solar-wind": "Solar panels or wind turbines",
        "other": "Other",
        "none": "None"
    }
    getOnSiteGenerationName(names: string[]) {
        return names?.map(x => this.onSiteGenerationMapper[x]) ?? [];
    }

    private energySupplyName: Record<string, string> = {
        "energy-supply-communal": "District or communal heating",
        "energy-supply-mains-electric": "Mains electricity supply",
        "energy-supply-mains-hydrogen": "Mains hydrogen supply",
        "energy-supply-mains-gas": "Mains gas supply",
        "energy-supply-oil": "Oil",
        "energy-supply-other": "Other",
        "none": "None"
    }
    getEnergySupplyName(names: string[]) {
        return names?.map(x => this.energySupplyName[x]) ?? [];
    }

    private materialNameMapper: Record<string, string> = {
        "composite_steel_concrete": "Composite steel and concrete",
        "concrete_large_panels_1960": "Concrete large panel system - 1960s",
        "concrete_large_panels_1970": "Concrete large panel system - 1970 onwards",
        "modular_concrete": "Modular - concrete",
        "concrete_other": "Concrete - other",
        "lightweight_metal": "Lightweight metal structure, like aluminium",
        "Masonry": "Masonry",
        "modular_steel": "Modular - steel",
        "steel_frame": "Steel frame",
        "modular_other_metal": "Modular - other metal",
        "modular_timber": "Modular - timber",
        "timber": "Timber",
        "none": "None"

    }
    getMaterialName(name: string) {
        return this.materialNameMapper[name];
    }
    getMaterialNames(names: string[]) {
        return names?.map(x => this.materialNameMapper[x]) ?? [];
    }

    getModularMaterials(buildingStructure: BuildingStructure) {
        const modularMaterials = buildingStructure?.BuildingStructureType?.filter(material => material.toLowerCase().includes("modular")).map(material => this.getMaterialName(material));

        if ((modularMaterials?.length ?? 0) > 0) {
            return modularMaterials;
        }
        else {

            return ["None"];
        }

    }

    getNonModularMaterials(buildingStructure: BuildingStructure) {
        const nonModularMaterials = buildingStructure?.BuildingStructureType?.filter(material => !material.toLowerCase().includes("modular")).map(material => this.getMaterialName(material));

        if ((nonModularMaterials?.length ?? 0) > 0) {
            return nonModularMaterials;
        }
        else {
            return ["None"];
        }

    }

    private roofTypeMapper: Record<string, string> = {
        "flat-roof": "Flat roof",
        "pitched-roof": "Pitched roof",
        "mix-flat-pitched": "Mix of flat and pitched"

    }
    getRoofType(name: string) {
        return this.roofTypeMapper[name];
    }

    private roofMaterialMapper: Record<string, string> = {
        "composite-panels": "Composite panels",
        "fibre-cement": "Fibre cement asbestos",
        "metal-sheet": "Metal sheet",
        "plastic-sheet": "Plastic sheet",
        "polycarbonate-sheet": "Polycarbonate sheet",
        "other-sheet-material": "Other sheet material",
        "rolled-liquid-bitumen-felt": "Rolled or liquid - bitumen felt",
        "rolled-liquid-other-felt": "Rolled or liquid - other felt",
        "rolled-liquid-rubber": "Rolled or liquid rubber",
        "rolled-liquid-hot-cold-roof": "Rolled or liquid hot or cold roof systems",
        "raac": "Reinforced autoclaved aerated concrete (RAAC)",
        "shingles": "Shingles",
        "slate": "Slate",
        "tiles": "Tiles",
        "green-roof": "Green roof",
        "none": "None"
    }
    getRoofMaterial(name: string) {
        return this.roofMaterialMapper[name];
    }

    private roofInsulationTypeMapper: Record<string, string> = {
        "yes-top": "Yes, on top of the roof structure",
        "yes-below": "Yes, below the roof structure",
        "no": "No"
    }
    getRoofInsulation(name: string) {
        return this.roofInsulationTypeMapper[name];
    }

    private externalWallMaterialsMapper: Record<string, string> = {
        "acm": "Aluminium composite materials (ACM)",
        "hpl": "High pressure laminate (HPL)",
        "metal-composite-panels": "Metal composite panels",
        "other-composite-panels": "Other composite panels",
        "concrete": "Concrete",
        "green-walls": "Green walls",
        "masonry": "Masonry",
        "metal-panels": "Metal panels",
        "render": "Render",
        "tiles": "Tiles",
        "timber": "Timber",
        "glass": "Glass",
        "other": "Other"
    }
    getExternalWallMaterialName(names: string[]) {
        return names?.map(x => this.externalWallMaterialsMapper[x]) ?? [];
    }

    getExternalWallMaterialNameWithPercentage(names: string[], ExternalWallMaterialsPercentage: Record<string, string>) {
        return names?.map(x => `${this.externalWallMaterialsMapper[x]}: ${ExternalWallMaterialsPercentage[x]}`) ?? [];
    }

    private acmFireTestsMapper: Record<string, string> = {
        "fire-classification": "Meets the fire classification A2-s1, d0 or better",
        "large-scale-fire-test": "Has passed a large-scale fire test to BS8414",
        "neither-these": "Does not meet A2-s1, d0 and has not passed BS8414"

    }
    getACMFireTests(name: string) {
        return this.acmFireTestsMapper[name];
    }

    private hplFireTestsMapper: Record<string, string> = {
        "fire-classification": "Meets the fire classification A2-s1, d0 or better",
        "large-scale-fire-test": "Has passed a large-scale fire test to BS8414",
        "none": "Does not meet A2-s1, d0 and has not passed BS8414"

    }
    getHPLFireTests(name: string) {
        return this.hplFireTestsMapper[name];
    }

    private insulationTypeMapper: Record<string, string> = {
        "fibre_glass_mineral_wool": "Fibre insulation - glass or mineral wool",
        "fibre_wood_sheep_wool": "Fibre insulation - wood or sheep wool",
        "foil_bubble_multifoil_insulation": "Foil bubble or multifoil insulation",
        "phenolic_foam": "Phenolic foam",
        "eps_xps": "Polystyrene insulation - expanded polystyrene (EPS) or extruded polystyrene (XPS)",
        "pur_pir_iso": "Polyurethane (PUR) or polyisocyanurate (PIR or ISO)",
        "other": "Other",
        "none": "None"
    }
    getInsulationName(ExternalWallInsulation: { CheckBoxSelection?: string[], OtherValue?: string }) {
        return ExternalWallInsulation?.CheckBoxSelection?.map(x => x === 'other' ? `${this.insulationTypeMapper[x]} - ${ExternalWallInsulation?.OtherValue ?? ""}` : this.insulationTypeMapper[x]) ?? [];
    }
    getInsulationNameWithPercentage(ExternalWallInsulation: { CheckBoxSelection?: string[], OtherValue?: string }, Percentages: Record<string, number>) {
        return ExternalWallInsulation?.CheckBoxSelection?.map(x => x === 'other' ? `${this.insulationTypeMapper[x]} - ${ExternalWallInsulation?.OtherValue ?? ""}: ${Percentages[x]}` : `${this.insulationTypeMapper[x]}: ${Percentages[x]}`) ?? [];
    }

    private features = ['balconies', 'communal_walkway', 'escape_route_roof', 'external_staircases', 'machinery_outbuilding', 'machinery_roof_room', 'roof_lights', 'solar_shading'];
    getAvailableFeatures(ExternalFeatures: string[]) {
        return ExternalFeatures?.filter(x => this.features.includes(x)) ?? [];
    }

    private externalFeaturesMapper: Record<string, string> = {
        "advertising": "Advertising hoarding attached to a wall",
        "balconies": "Balconies",
        "communal_recreation_area": "Communal recreation area on the roof",
        "communal_walkway": "Communal walkway between structures",
        "escape_route_roof": "Escape route onto and across the roof",
        "external_staircases": "External staircases",
        "machinery_outbuilding": "Machinery in an outbuilding",
        "machinery_roof_room": "Machinery in a room on the roof",
        "machinery_roof": "Machinery on the roof",
        "phone_masts": "Phone masts",
        "roof_lights": "Roof lights",
        "solar_shading": "Solar shading",
        "other": "Other",
        "none": "None"
    }

    getExternalFeature(names: string[]) {
        return names?.map(x => this.externalFeaturesMapper[x]) ?? [];
    }

    private featureNameMapper: Record<string, string> = {
        "balconies": "Balconies",
        "communal_walkway": "Communal walkways",
        "escape_route_roof": "Escape route across the roof",
        "solar_shading": "Solar shading",
        "external_staircases": "Staircases",
        "roof_lights": "Roof lights",
        "machinery_outbuilding": "Machinery in an outbuilding",
        "machinery_roof_room": "Machinery in a room on the roof"
    }
    getFeatureName(name: string) {
        return this.featureNameMapper[name];
    }

    hasFeature(name: string, FeatureMaterialsOutside: Record<string, string[]>) {
        if (!FeatureMaterialsOutside) return false;
        return Object.keys(FeatureMaterialsOutside).includes(name);
    }

    getMaterials(feature: string, FeatureMaterialsOutside: Record<string, string[]>) {
        return this.hasFeature(feature, FeatureMaterialsOutside) ? FeatureMaterialsOutside[feature] : [];
    }

    private materialsMapper: Record<string, string> = {
        "aluminium": "Aluminium",
        "concrete": "Concrete",
        "glass": "Glass",
        "masonry": "Masonry",
        "metal": "Metal",
        "plastic": "Plastic",
        "slate": "Slate",
        "timber": "Timber",
        "other": "Other"
    }

    getExternalFeatureMaterialName(names: string[]) {
        return names?.map(x => this.materialsMapper[x]) ?? [];
    }

    private buildingUseMapper: Record<string, string> = {
        "assembly_and_recreation": "Assembly and recreation",
        "assembly_recreation": "Assembly and recreation",
        "office": "Office",
        "residential_dwellings": "Residential dwellings",
        "residential_institution": "Residential institution",
        "other_residential_use": "Other residential use",
        "shop_and_commercial": "Shop and commercial",
        "shop_commercial": "Shop and commercial",
        "other_non-residential": "Other non-residential",
        "other_non_residential": "Other non-residential",
        "none": "None"
    }
    getBuildingUse(names: string[]) {
        return names?.map(x => this.buildingUseMapper[x]) ?? [];
    }


    private buildingWorksMapper: Record<string, string> = {
        "asbestos_removal": "Asbestos removal",
        "balconies_added": "Balconies added",
        "changes_residential_units": "Change to number of residential units",
        "changes_staircase_cores": "Changes to staircases",
        "changes_windows": "Changes to windows",
        "complete_rewiring": "Complete rewiring",
        "floors_added": "Change to number of floors",
        "floors_removed": "Change to number of floors",
        "installation_replacement_removal_fire_systems": "Changes to fire systems",
        "installation_replacement_removal_lighting": "Changes to lighting",
        "installation_replacement_removal_cold_water_systems": "Changes to cold water systems",
        "installation_replacement_removal_gas_supply": "Changes to gas supply",
        "reinforcement_works_large_panel_system": "Reinforcement of large panel system structure",
        "work_external_walls": "Work connected to external walls",
        "unknown": "Not Known",
        "none": "None"
    }
    getBuildingWorksName(names: string[]) {
        return names?.map(x => this.buildingWorksMapper[x]) ?? [];
    }
}