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

@Injectable()
export class KbiNavigation extends BaseNavigation {

  constructor(private applicationService: ApplicationService) {
    super();
  }

  private estimatedPercentageNavigationNode = new EstimatedPercentageNavigationNode(this.applicationService);
  private wallHplNavigationNode = new WallsHplNavigationNode(this.applicationService, this.estimatedPercentageNavigationNode);
  private wallAcmNavigationNode = new WallsAcmNavigationNode(this.applicationService, this.wallHplNavigationNode, this.estimatedPercentageNavigationNode);
  private externalWallMaterialsNavigationNode = new ExternalWallMaterialsNavigationNode(this.applicationService, this.wallAcmNavigationNode, this.wallHplNavigationNode, this.estimatedPercentageNavigationNode);
  private totalStaircasesNavigationNode = new TotalStaircasesNavigationNode(this.applicationService, this.externalWallMaterialsNavigationNode);
  private roofMaterialNavigationNode = new RoofMaterialNavigationNode(this.applicationService, this.totalStaircasesNavigationNode);
  private insulationLayerNavigationNode = new InsulationLayerNavigationNode(this.applicationService, this.roofMaterialNavigationNode);
  private roofTypeNavigationNode = new RoofTypeNavigationNode(this.applicationService, this.insulationLayerNavigationNode);
  private buildingStructureTypeNavigationNode = new BuildingStructureTypeNavigationNode(this.applicationService, this.roofTypeNavigationNode);
  private energySupplyNavigationNode = new EnergySupplyNavigationNode(this.applicationService, this.buildingStructureTypeNavigationNode);
  private onSiteEnergyGenerationNavigationNode = new OnSiteEnergyGenerationNavigationNode(this.applicationService, this.energySupplyNavigationNode);
  private energyTypeStorageNavigationNode = new EnergyTypeStorageNavigationNode(this.applicationService, this.onSiteEnergyGenerationNavigationNode)
  private fireDoorsCommonNavigationNode = new FireDoorsCommonNavigationNode(this.applicationService, this.energyTypeStorageNavigationNode);
  private residentialUnitFrontDoorsFireResistanceNavigationNode = new ResidentialUnitFrontDoorsFireResistanceNavigationNode(this.applicationService, this.fireDoorsCommonNavigationNode);
  private liftsNavigationNode = new LiftsNavigationNode(this.applicationService, this.residentialUnitFrontDoorsFireResistanceNavigationNode);
  private fireSmokeProvisionLocationsNavigationNode = new FireSmokeProvisionLocationsNavigationNode(this.applicationService, this.liftsNavigationNode);
  private fireSmokeProvisionsNavigationNode = new FireSmokeProvisionsNavigationNode(this.applicationService, this.fireSmokeProvisionLocationsNavigationNode, this.liftsNavigationNode);
  private provisionsEquipmentNavigationNode = new ProvisionsEquipmentNavigationNode(this.applicationService, this.fireSmokeProvisionsNavigationNode);
  private evacuationStrategyNavigationNode = new EvacuationStrategyNavigationNode(this.applicationService, this.provisionsEquipmentNavigationNode);
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
  constructor(private applicationService: ApplicationService,
    private provisionsEquipmentNavigationNode: ProvisionsEquipmentNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private fireSmokeProvisionsNavigationNode: FireSmokeProvisionsNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private fireSmokeProvisionLocationsNavigationNode: FireSmokeProvisionLocationsNavigationNode,
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
  constructor(private applicationService: ApplicationService, private liftsNavigationNode: LiftsNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private residentialUnitFrontDoorsFireResistanceNavigationNode: ResidentialUnitFrontDoorsFireResistanceNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private fireDoorsCommonNavigationNode: FireDoorsCommonNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private energyTypeStorageNavigationNode: EnergyTypeStorageNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private onSiteEnergyGenerationNavigationNode: OnSiteEnergyGenerationNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private energySupplyNavigationNode: EnergySupplyNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private buildingStructureTypeNavigationNode: BuildingStructureTypeNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private roofTypeNavigationNode: RoofTypeNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private insulationLayerNavigationNode: InsulationLayerNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private roofMaterialNavigationNode: RoofMaterialNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private totalStaircasesNavigationNode: TotalStaircasesNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private externalWallMaterialsNavigationNode: ExternalWallMaterialsNavigationNode) {
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
  constructor(private applicationService: ApplicationService,
    private wallAcmNavigationNode: WallsAcmNavigationNode,
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
  constructor(private applicationService: ApplicationService,
    private wallHplNavigationNode: WallsHplNavigationNode,
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
  constructor(private applicationService: ApplicationService,
    private estimatedPercentageNavigationNode: EstimatedPercentageNavigationNode) {
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
  constructor(private applicationService: ApplicationService) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.ExternalWallMaterialsPercentage || Object.keys(kbi.ExternalWallMaterialsPercentage).length == 0
      || kbi.ExternalWallMaterials!.some(x => !kbi!.ExternalWallMaterialsPercentage![x] || kbi!.ExternalWallMaterialsPercentage![x].length == 0)) {
      return EstimatedPercentageComponent.route;
    }
    return EstimatedPercentageComponent.route;
  }
}