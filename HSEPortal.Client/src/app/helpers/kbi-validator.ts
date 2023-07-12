import { FieldValidations } from './validators/fieldvalidations';
import { Fire, Energy, BuildingStructure, Roof, KbiSectionModel, Staircases, Walls, BuildingUse } from '../services/application.service';

export class KbiValidator {

    static validateFire(Fire: Fire) { 
        let isValid = true;

        isValid &&= FieldValidations.IsNotNullOrWhitespace(Fire.StrategyEvacuateBuilding);
        // isValid &&= FieldValidations.IsNotNullOrEmpty(Fire.FireSmokeProvisions);
        
        // if(isValid && !Fire.FireSmokeProvisions?.includes("none")) {
        //     isValid &&= FieldValidations.IsNotNullAndValuesAreNotEmpty(Fire.FireSmokeProvisionLocations);
        // }

        isValid &&= FieldValidations.IsNotNullOrEmpty(Fire.Lifts);
        
        isValid &&= FieldValidations.IsAPositiveNumber(Fire.FireDoorsCommon?.FireDoorUnknown);
        isValid &&= FieldValidations.IsAPositiveNumber(Fire.FireDoorsCommon?.FireDoorThirtyMinute);
        isValid &&= FieldValidations.IsAPositiveNumber(Fire.FireDoorsCommon?.FireDoorSixtyMinute);
        isValid &&= FieldValidations.IsAPositiveNumber(Fire.FireDoorsCommon?.FireDoorHundredTwentyMinute);
        
        isValid &&= FieldValidations.IsAPositiveNumber(Fire.ResidentialUnitFrontDoors?.NotKnownFireResistance);
        isValid &&= FieldValidations.IsAPositiveNumber(Fire.ResidentialUnitFrontDoors?.NoFireResistance);
        isValid &&= FieldValidations.IsAPositiveNumber(Fire.ResidentialUnitFrontDoors?.ThirtyMinsFireResistance);
        isValid &&= FieldValidations.IsAPositiveNumber(Fire.ResidentialUnitFrontDoors?.SixtyMinsFireResistance);
        isValid &&= FieldValidations.IsAPositiveNumber(Fire.ResidentialUnitFrontDoors?.HundredTwentyMinsFireResistance);

        return isValid;
    }
    
    static validateEnergy(Energy: Energy) { 
        let isValid = true;

        isValid &&= FieldValidations.IsNotNullOrEmpty(Energy.EnergyTypeStorage);
        isValid &&= FieldValidations.IsNotNullOrEmpty(Energy.EnergySupply);
        isValid &&= FieldValidations.IsNotNullOrEmpty(Energy.OnsiteEnergyGeneration);

        return isValid;
    }
    
    static validateBuildingStructure(BuildingStructure: BuildingStructure) { 
        return FieldValidations.IsNotNullOrEmpty(BuildingStructure.BuildingStructureType);
    }

    static validateRoof(Roof: Roof) { 
        let isValid = true;

        isValid &&= FieldValidations.IsNotNullOrWhitespace(Roof.RoofType);
        isValid &&= FieldValidations.IsNotNullOrWhitespace(Roof.RoofInsulation);
        isValid &&= FieldValidations.IsNotNullOrWhitespace(Roof.RoofMaterial);

        return isValid;
    }

    static validateStaircases(Staircases: Staircases) {
        let isValid = true;

        isValid &&= FieldValidations.IsAPositiveNumber(Staircases.InternalStaircasesAllFloors);
        isValid &&= FieldValidations.IsAPositiveNumber(Staircases.TotalNumberStaircases);

        return isValid;
    }

    private static features: string[] = ['balconies', 'communal_walkway', 'escape_route_roof', 'external_staircases', 'machinery_outbuilding', 'machinery_roof_room', 'roof_lights', 'solar_shading'];
    static validateWalls(Walls: Walls) {
        let isValid = true;

        isValid &&= FieldValidations.IsNotNullOrEmpty(Walls.ExternalWallMaterials);

        if(isValid && Walls.ExternalWallMaterials?.includes("acm")) {
            isValid &&= FieldValidations.IsNotNullOrWhitespace(Walls.WallACM);
        }

        if(isValid && Walls.ExternalWallMaterials?.includes("hpl")) {
            isValid &&= FieldValidations.IsNotNullOrWhitespace(Walls.WallHPL);
        }

        isValid &&= FieldValidations.IsNotNullAndValueIsNotNullOrWhitespace(Walls.ExternalWallMaterialsPercentage);
        isValid &&= Object.keys(Walls.ExternalWallMaterialsPercentage!).map(x => Number(Walls.ExternalWallMaterialsPercentage![x])).reduce((previous, current) => previous + current) == 100;

        isValid &&= FieldValidations.IsNotNullOrEmpty(Walls.ExternalWallInsulation?.CheckBoxSelection);
        if(isValid && Walls.ExternalWallInsulation?.CheckBoxSelection?.includes('other')) {
            isValid &&= FieldValidations.IsNotNullOrWhitespace(Walls.ExternalWallInsulation?.OtherValue);
        }
        
        if(isValid && !Walls.ExternalWallInsulation?.CheckBoxSelection?.includes('none')) {
            isValid &&= FieldValidations.IsNotNullAndValueIsAPositiveNumber(Walls.ExternalWallInsulationPercentages);
            isValid &&= Object.keys(Walls.ExternalWallInsulationPercentages!).map(x => Number(Walls.ExternalWallInsulationPercentages![x])).reduce((previous, current) => previous + current) == 100;
        }
        
        isValid &&= FieldValidations.IsNotNullOrEmpty(Walls.ExternalFeatures);
        if(isValid && this.features.some(x => Walls.ExternalFeatures?.includes(x))) {
            let filteredExternalFeatures = Walls.ExternalFeatures!.filter(x => this.features.includes(x));
            isValid &&= this.areEqual(filteredExternalFeatures, Object.keys(Walls.FeatureMaterialsOutside!));
            isValid &&= FieldValidations.IsNotNullAndValuesAreNotEmpty(Walls.FeatureMaterialsOutside);
        }

        return isValid;
    }

    private static areEqual(a: string[], b: string[]) {
        return a.length === b.length && a.every(x => b.indexOf(x) > -1);
    }    

    static validateBuildingUse(BuildingUse: BuildingUse) { 
        let isValid = true;

        isValid &&= FieldValidations.IsNotNullOrWhitespace(BuildingUse.PrimaryUseOfBuilding);
        isValid &&= FieldValidations.IsNotNullOrEmpty(BuildingUse.SecondaryUseBuilding);
        isValid &&= FieldValidations.IsAPositiveNumber(BuildingUse.FloorsBelowGroundLevel);

        if(isValid && (BuildingUse.FloorsBelowGroundLevel ?? -1) >= 1) {
            isValid &&= FieldValidations.IsNotNullOrWhitespace(BuildingUse.PrimaryUseBuildingBelowGroundLevel);
        }

        if(isValid && BuildingUse.PrimaryUseOfBuilding === "residential_dwellings") {
            isValid &&= FieldValidations.IsNotNullOrWhitespace(BuildingUse.ChangePrimaryUse);
            if (isValid && BuildingUse.ChangePrimaryUse === 'yes') {
                isValid &&= FieldValidations.IsNotNullOrWhitespace(BuildingUse.PreviousUseBuilding);
            }
        } 

        isValid &&= FieldValidations.IsNotNullOrEmpty(BuildingUse.UndergoneBuildingMaterialChanges);

        if(isValid && BuildingUse.UndergoneBuildingMaterialChanges?.includes('floors_added')) {
            isValid &&= FieldValidations.IsNotNullOrEmpty(BuildingUse.AddedFloorsType);
        }

        if(isValid && (BuildingUse.UndergoneBuildingMaterialChanges?.length ?? -1) > 1) {
            isValid &&= FieldValidations.IsNotNullOrWhitespace(BuildingUse.MostRecentMaterialChange);
        }

        return isValid;
    }

    static isKbiSectionValid(KbiSectionModel: KbiSectionModel | undefined) {
        if (!KbiSectionModel) return false;

        let isValid = true;
        
        isValid &&= this.validateFire(KbiSectionModel.Fire);
        isValid &&= this.validateEnergy(KbiSectionModel.Energy);
        isValid &&= this.validateBuildingStructure(KbiSectionModel.BuildingStructure);
        isValid &&= this.validateRoof(KbiSectionModel.Roof);
        isValid &&= this.validateWalls(KbiSectionModel.Walls);
        isValid &&= this.validateBuildingUse(KbiSectionModel.BuildingUse);

        return isValid;
    }

}