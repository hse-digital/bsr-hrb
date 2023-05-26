import { Injectable } from '@angular/core';
import { BaseNavigation, KbiNavigationNode } from '../../services/navigation';
import { ApplicationService, KbiSectionModel, BuildingApplicationStatus } from '../../services/application.service';
import { CheckBeforeStartComponent } from 'src/app/features/kbi/check-before-start/check-before-start.component';
import { EvacuationStrategyComponent } from 'src/app/features/kbi/evacuation-strategy/evacuation-strategy.component';
import { ProvisionsEquipmentComponent } from 'src/app/features/kbi/provisions-equipment/provisions-equipment.component';
import { FireSmokeProvisionsComponent } from 'src/app/features/kbi/fire-smoke-provisions/fire-smoke-provisions.component';
import { FireSmokeProvisionLocationsComponent } from 'src/app/features/kbi/fire-smoke-provision-locations/fire-smoke-provision-locations.component';
import { LiftsComponent } from 'src/app/features/kbi/lifts/lifts.component';
import { ResidentialUnitFrontDoorsFireResistanceComponent } from 'src/app/features/kbi/residential-unit-front-doors-fire-resistance/residential-unit-front-doors-fire-resistance.component';
import { FireDoorsCommonComponent } from 'src/app/features/kbi/fire-doors-common/fire-doors-common.component';
import { EnergyTypeComponent } from 'src/app/features/kbi/energy-type/energy-type.component';
import { OnSiteEnergyGenerationComponent } from 'src/app/features/kbi/on-site-energy-generation/on-site-energy-generation.component';
import { TotalStaircasesComponent } from 'src/app/features/kbi/total-staircases/total-staircases.component';
import { BuildingStructureTypeComponent } from 'src/app/features/kbi/building-structure-type/building-structure-type.component';
import { RoofTypeComponent } from 'src/app/features/kbi/roof-type/roof-type.component';
import { InsulationLayerComponent } from 'src/app/features/kbi/insulation-layer/insulation-layer.component';
import { RoofMaterialComponent } from 'src/app/features/kbi/roof-material/roof-material.component';
import { WallsAcmComponent } from './walls-acm/walls-acm.component';
import { WallsHplComponent } from './walls-hpl/walls-hpl.component';
import { ExternalWallMaterialsComponent } from './external-wall-materials/external-wall-materials.component';
import { EstimatedPercentageComponent } from './estimated-percentage/estimated-percentage.component';
import { TaskListComponent } from './task-list/task-list.component';
import { EnergySupplyComponent } from './energy-supply/energy-supply.component';
import { ExternalWallInsulationTypeComponent } from './external-wall-insulation-type/external-wall-insulation-type.component';
import { ExternalWallInsulationPercentageComponent } from './external-wall-insulation-percentage/external-wall-insulation-percentage.component';
import { ExternalFeaturesComponent } from './external-features/external-features.component';
import { FeatureMaterialsOutsideComponent } from './feature-materials-outside/feature-materials-outside.component';
import { PrimaryUseOfBuildingComponent } from './primary-use-of-building/primary-use-of-building.component';
import { SecondaryUseBuildingComponent } from './secondary-use-building/secondary-use-building.component';
import { FloorsBelowGroundLevelComponent } from './floors-below-ground-level/floors-below-ground-level.component';

@Injectable()
export class KbiNavigation extends BaseNavigation {

  constructor(private applicationService: ApplicationService) {
    super();
  }

  private floorsBelowGroundLevelNavigationNode = new FloorsBelowGroundLevelNavigationNode();
  private secondaryUseBuildingNavigationNode = new SecondaryUseBuildingNavigationNode(this.floorsBelowGroundLevelNavigationNode);
  private primaryUseBuildingNavigationNode = new PrimaryUseBuildingNavigationNode(this.secondaryUseBuildingNavigationNode);
  private featuresMaterialsOutsideNavigationNode = new FeaturesMaterialsOutsideNavigationNode(this.primaryUseBuildingNavigationNode);
  private externalFeaturesNavigationNode = new ExternalFeaturesNavigationNode(this.featuresMaterialsOutsideNavigationNode, this.primaryUseBuildingNavigationNode);
  private externalWallInsulationPercentageNavigationNode = new ExternalWallInsulationPercentageNavigationNode(this.externalFeaturesNavigationNode);
  private externalWallInsulationTypeNavigationNode = new ExternalWallInsulationTypeNavigationNode(this.externalWallInsulationPercentageNavigationNode, this.externalFeaturesNavigationNode);
  private estimatedPercentageNavigationNode = new EstimatedPercentageNavigationNode(this.externalWallInsulationTypeNavigationNode);
  private wallHplNavigationNode = new WallsHplNavigationNode(this.estimatedPercentageNavigationNode);
  private wallAcmNavigationNode = new WallsAcmNavigationNode(this.wallHplNavigationNode, this.estimatedPercentageNavigationNode);
  private externalWallMaterialsNavigationNode = new ExternalWallMaterialsNavigationNode(this.wallAcmNavigationNode, this.wallHplNavigationNode, this.estimatedPercentageNavigationNode);
  private totalStaircasesNavigationNode = new TotalStaircasesNavigationNode(this.externalWallMaterialsNavigationNode);
  private roofMaterialNavigationNode = new RoofMaterialNavigationNode(this.totalStaircasesNavigationNode);
  private insulationLayerNavigationNode = new InsulationLayerNavigationNode(this.roofMaterialNavigationNode);
  private roofTypeNavigationNode = new RoofTypeNavigationNode(this.insulationLayerNavigationNode);
  private buildingStructureTypeNavigationNode = new BuildingStructureTypeNavigationNode(this.roofTypeNavigationNode);
  private energySupplyNavigationNode = new EnergySupplyNavigationNode(this.buildingStructureTypeNavigationNode);
  private onSiteEnergyGenerationNavigationNode = new OnSiteEnergyGenerationNavigationNode(this.energySupplyNavigationNode);
  private energyTypeStorageNavigationNode = new EnergyTypeStorageNavigationNode(this.onSiteEnergyGenerationNavigationNode)
  private fireDoorsCommonNavigationNode = new FireDoorsCommonNavigationNode(this.energyTypeStorageNavigationNode);
  private residentialUnitFrontDoorsFireResistanceNavigationNode = new ResidentialUnitFrontDoorsFireResistanceNavigationNode(this.fireDoorsCommonNavigationNode);
  private liftsNavigationNode = new LiftsNavigationNode(this.residentialUnitFrontDoorsFireResistanceNavigationNode);
  private fireSmokeProvisionLocationsNavigationNode = new FireSmokeProvisionLocationsNavigationNode(this.liftsNavigationNode);
  private fireSmokeProvisionsNavigationNode = new FireSmokeProvisionsNavigationNode(this.fireSmokeProvisionLocationsNavigationNode, this.liftsNavigationNode);
  private provisionsEquipmentNavigationNode = new ProvisionsEquipmentNavigationNode(this.fireSmokeProvisionsNavigationNode);
  private evacuationStrategyNavigationNode = new EvacuationStrategyNavigationNode(this.provisionsEquipmentNavigationNode);
  private checkBeforeStartNavigationNode = new CheckBeforeStartNavigationNode(this.applicationService, this.evacuationStrategyNavigationNode);

  override getNextRoute(): string {
    if (this.applicationService.model.Kbi?.KbiSections == null || this.applicationService.model.Kbi!.KbiSections.length == 0) {
      return CheckBeforeStartComponent.route;
    }

    for (let sectionIndex = 0; sectionIndex < this.applicationService.model.Kbi!.KbiSections.length; sectionIndex++) {
      let kbiSection = this.applicationService.model.Kbi!.KbiSections[sectionIndex];
      let sectionRoute = this.checkBeforeStartNavigationNode.getNextRoute(kbiSection, sectionIndex);
      return `${sectionRoute}`;
    }

    return `/`;
  }
}

class CheckBeforeStartNavigationNode extends KbiNavigationNode {
  constructor(private applicationService: ApplicationService,
    private evacuationStrategyNavigationNode: EvacuationStrategyNavigationNode) {
    super();
  }

  override getNextRoute(kbiSectionModel: KbiSectionModel, kbiSectionIndex: number) {
    if ((this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.KbiCheckBeforeComplete) !== BuildingApplicationStatus.KbiCheckBeforeComplete) {
      return CheckBeforeStartComponent.route;
    }
    return this.evacuationStrategyNavigationNode.getNextRoute(kbiSectionModel, kbiSectionIndex);
  }
}

class EvacuationStrategyNavigationNode extends KbiNavigationNode {
  constructor(private provisionsEquipmentNavigationNode: ProvisionsEquipmentNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.StrategyEvacuateBuilding) {
      return EvacuationStrategyComponent.route;
    }
    return this.provisionsEquipmentNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }

}

class ProvisionsEquipmentNavigationNode extends KbiNavigationNode {
  constructor(private fireSmokeProvisionsNavigationNode: FireSmokeProvisionsNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.ProvisionsEquipment || kbi.ProvisionsEquipment.length == 0) {
      return ProvisionsEquipmentComponent.route;
    }
    return this.fireSmokeProvisionsNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }

}

class FireSmokeProvisionsNavigationNode extends KbiNavigationNode {
  constructor(private fireSmokeProvisionLocationsNavigationNode: FireSmokeProvisionLocationsNavigationNode,
    private liftsNavigationNode: LiftsNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.FireSmokeProvisions || kbi.FireSmokeProvisions!.length == 0) {
      return FireSmokeProvisionsComponent.route;
    }

    if (kbi.FireSmokeProvisions!.length == 1 && kbi.FireSmokeProvisions![0] === 'none') {
      return this.liftsNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }

    return this.fireSmokeProvisionLocationsNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class FireSmokeProvisionLocationsNavigationNode extends KbiNavigationNode {
  constructor(private liftsNavigationNode: LiftsNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.FireSmokeProvisionLocations || Object.keys(kbi.FireSmokeProvisionLocations).length == 0) {
      return FireSmokeProvisionLocationsComponent.route;
    }

    if (kbi.FireSmokeProvisions!.some(x => !kbi!.FireSmokeProvisionLocations![x] || kbi!.FireSmokeProvisionLocations![x].length == 0)) {
      let nextEquipment = kbi.FireSmokeProvisions!.find(x => !kbi!.FireSmokeProvisionLocations![x] || kbi!.FireSmokeProvisionLocations![x].length == 0);
      return `${FireSmokeProvisionLocationsComponent.route}?equipment=${nextEquipment}`;
    }

    return this.liftsNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class LiftsNavigationNode extends KbiNavigationNode {
  constructor(private residentialUnitFrontDoorsFireResistanceNavigationNode: ResidentialUnitFrontDoorsFireResistanceNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Lifts || kbi.Lifts.length == 0) {
      return LiftsComponent.route;
    }
    return this.residentialUnitFrontDoorsFireResistanceNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class ResidentialUnitFrontDoorsFireResistanceNavigationNode extends KbiNavigationNode {
  constructor(private fireDoorsCommonNavigationNode: FireDoorsCommonNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.ResidentialUnitFrontDoors || !kbi.ResidentialUnitFrontDoors.NoFireResistance
      || !kbi.ResidentialUnitFrontDoors.ThirtyMinsFireResistance
      || !kbi.ResidentialUnitFrontDoors.SixtyMinsFireResistance
      || !kbi.ResidentialUnitFrontDoors.HundredTwentyMinsFireResistance
      || !kbi.ResidentialUnitFrontDoors.NotKnownFireResistance) {
      return ResidentialUnitFrontDoorsFireResistanceComponent.route;
    }
    return this.fireDoorsCommonNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class FireDoorsCommonNavigationNode extends KbiNavigationNode {
  constructor(private energyTypeStorageNavigationNode: EnergyTypeStorageNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.FireDoorsCommon || !kbi.FireDoorsCommon.FireDoorUnknown
      || !kbi.FireDoorsCommon.FireDoorThirtyMinute
      || !kbi.FireDoorsCommon.FireDoorSixtyMinute
      || !kbi.FireDoorsCommon.FireDoorHundredTwentyMinute) {
      return FireDoorsCommonComponent.route;
    }
    return this.energyTypeStorageNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class EnergyTypeStorageNavigationNode extends KbiNavigationNode {
  constructor(private onSiteEnergyGenerationNavigationNode: OnSiteEnergyGenerationNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.EnergyTypeStorage || kbi.EnergyTypeStorage.length == 0) {
      return EnergyTypeComponent.route;
    }
    return this.onSiteEnergyGenerationNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class OnSiteEnergyGenerationNavigationNode extends KbiNavigationNode {
  constructor(private energySupplyNavigationNode: EnergySupplyNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.OnsiteEnergyGeneration || kbi.OnsiteEnergyGeneration.length == 0) {
      return OnSiteEnergyGenerationComponent.route;
    }
    return this.energySupplyNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class EnergySupplyNavigationNode extends KbiNavigationNode {
  constructor(private buildingStructureTypeNavigationNode: BuildingStructureTypeNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.EnergySupply || kbi.EnergySupply.length == 0) {
      return EnergySupplyComponent.route;
    }
    return this.buildingStructureTypeNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class BuildingStructureTypeNavigationNode extends KbiNavigationNode {
  constructor(private roofTypeNavigationNode: RoofTypeNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.BuildingStructureType || kbi.BuildingStructureType.length == 0) {
      return BuildingStructureTypeComponent.route;
    }
    return this.roofTypeNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class RoofTypeNavigationNode extends KbiNavigationNode {
  constructor(private insulationLayerNavigationNode: InsulationLayerNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.RoofType) {
      return RoofTypeComponent.route;
    }
    return this.insulationLayerNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class InsulationLayerNavigationNode extends KbiNavigationNode {
  constructor(private roofMaterialNavigationNode: RoofMaterialNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.RoofInsulation) {
      return InsulationLayerComponent.route;
    }
    return this.roofMaterialNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class RoofMaterialNavigationNode extends KbiNavigationNode {
  constructor(private totalStaircasesNavigationNode: TotalStaircasesNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.RoofMaterial) {
      return RoofMaterialComponent.route;
    }
    return this.totalStaircasesNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class TotalStaircasesNavigationNode extends KbiNavigationNode {
  constructor(private externalWallMaterialsNavigationNode: ExternalWallMaterialsNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.TotalNumberStaircases || !kbi.InternalStaircasesAllFloors) {
      return TotalStaircasesComponent.route;
    }
    return this.externalWallMaterialsNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class ExternalWallMaterialsNavigationNode extends KbiNavigationNode {
  constructor(private wallAcmNavigationNode: WallsAcmNavigationNode,
    private wallHplNavigationNode: WallsHplNavigationNode,
    private estimatedPercentageNavigationNode: EstimatedPercentageNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.ExternalWallMaterials || kbi.ExternalWallMaterials.length == 0) {
      return ExternalWallMaterialsComponent.route;
    } else if (kbi.ExternalWallMaterials!.indexOf('acm') > -1) {
      return this.wallAcmNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    } else if (kbi.ExternalWallMaterials!.indexOf('hpl') > -1) {
      return this.wallHplNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
    return this.estimatedPercentageNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class WallsAcmNavigationNode extends KbiNavigationNode {
  constructor(private wallHplNavigationNode: WallsHplNavigationNode,
    private estimatedPercentageNavigationNode: EstimatedPercentageNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.WallACM) {
      return WallsAcmComponent.route;
    } else if (kbi.ExternalWallMaterials!.indexOf('hpl') > -1) {
      return this.wallHplNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
    return this.estimatedPercentageNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class WallsHplNavigationNode extends KbiNavigationNode {
  constructor(private estimatedPercentageNavigationNode: EstimatedPercentageNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.WallHPL) {
      return WallsHplComponent.route;
    }
    return this.estimatedPercentageNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class EstimatedPercentageNavigationNode extends KbiNavigationNode {
  constructor(private externalWallInsulationTypeNavigationNode: ExternalWallInsulationTypeNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.ExternalWallMaterialsPercentage || Object.keys(kbi.ExternalWallMaterialsPercentage).length == 0
      || kbi.ExternalWallMaterials!.some(x => !kbi!.ExternalWallMaterialsPercentage![x] || kbi!.ExternalWallMaterialsPercentage![x].length == 0)) {
      return EstimatedPercentageComponent.route;
    }
    return this.externalWallInsulationTypeNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class ExternalWallInsulationTypeNavigationNode extends KbiNavigationNode {
  constructor(private externalWallInsulationPercentageNavigationNode: ExternalWallInsulationPercentageNavigationNode,
    private externalFeaturesNavigationNode: ExternalFeaturesNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.ExternalWallInsulation || !kbi.ExternalWallInsulation.CheckBoxSelection || kbi.ExternalWallInsulation.CheckBoxSelection?.length == 0 || this.isOtherOptionSelectedButNotCompleted(kbi)) {
      return ExternalWallInsulationTypeComponent.route;
    } else if (kbi.ExternalWallInsulation.CheckBoxSelection.length == 1 && kbi.ExternalWallInsulation.CheckBoxSelection.includes('none')) {
      return this.externalFeaturesNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
    return this.externalWallInsulationPercentageNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }

  private isOtherOptionSelectedButNotCompleted(kbi: KbiSectionModel) {
    return kbi.ExternalWallInsulation!.CheckBoxSelection!.length > 0
      && kbi.ExternalWallInsulation!.CheckBoxSelection!.includes("other")
      && (!kbi.ExternalWallInsulation!.OtherValue || kbi.ExternalWallInsulation!.OtherValue.length == 0);
  }
}

class ExternalWallInsulationPercentageNavigationNode extends KbiNavigationNode {
  constructor(private externalFeaturesNavigationNode: ExternalFeaturesNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.ExternalWallInsulationPercentages || Object.keys(kbi.ExternalWallInsulationPercentages).length == 0
      || kbi.ExternalWallInsulation?.CheckBoxSelection?.length != Object.keys(kbi.ExternalWallInsulationPercentages).length
      || kbi.ExternalWallInsulation?.CheckBoxSelection?.some(x => !kbi.ExternalWallInsulationPercentages![x])) {
      return ExternalWallInsulationPercentageComponent.route;
    }
    return this.externalFeaturesNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class ExternalFeaturesNavigationNode extends KbiNavigationNode {
  constructor(private featuresMaterialsOutsideNavigationNode: FeaturesMaterialsOutsideNavigationNode,
    private primaryUseBuildingNavigationNode: PrimaryUseBuildingNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    const features = ['balconies', 'communal_walkway', 'escape_route_roof', 'external_staircases', 'machinery_outbuilding', 'machinery_roof_room', 'roof_lights', 'solar_shading'];
    if (!kbi.ExternalFeatures || kbi.ExternalFeatures.length == 0) {
      return ExternalFeaturesComponent.route;
    } else if (kbi.ExternalFeatures?.some(x => features.includes(x))) {
      return this.featuresMaterialsOutsideNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
    return this.primaryUseBuildingNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class FeaturesMaterialsOutsideNavigationNode extends KbiNavigationNode {
  constructor(private primaryUseBuildingNavigationNode: PrimaryUseBuildingNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.FeatureMaterialsOutside || Object.keys(kbi.FeatureMaterialsOutside).length == 0) {
      return FeatureMaterialsOutsideComponent.route;
    } else if (Object.keys(kbi.FeatureMaterialsOutside).some(x => !kbi.FeatureMaterialsOutside![x] || kbi.FeatureMaterialsOutside![x].length == 0)) {
      let nextFeature = kbi.ExternalFeatures!.find(x => !kbi!.FeatureMaterialsOutside![x] || kbi!.FeatureMaterialsOutside![x].length == 0);
      return `${FeatureMaterialsOutsideComponent.route}?feature=${nextFeature}`;
    }
    return this.primaryUseBuildingNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class PrimaryUseBuildingNavigationNode extends KbiNavigationNode {
  constructor(private secondaryUseBuildingNavigationNode: SecondaryUseBuildingNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.PrimaryUseOfBuilding || kbi.PrimaryUseOfBuilding.length == 0) {
      return PrimaryUseOfBuildingComponent.route;
    }
    return this.secondaryUseBuildingNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class SecondaryUseBuildingNavigationNode extends KbiNavigationNode {
  constructor(private floorsBelowGroundLevelNavigationNode: FloorsBelowGroundLevelNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.SecondaryUseBuilding || kbi.SecondaryUseBuilding.length == 0) {
      return SecondaryUseBuildingComponent.route;
    }
    return this.floorsBelowGroundLevelNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class FloorsBelowGroundLevelNavigationNode extends KbiNavigationNode {
  constructor() {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.FloorsBelowGroundLevel) {
      return FloorsBelowGroundLevelComponent.route;
    }
    return FloorsBelowGroundLevelComponent.route;
  }
}