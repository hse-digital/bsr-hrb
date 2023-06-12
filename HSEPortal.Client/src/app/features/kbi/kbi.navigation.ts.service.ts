import { Injectable } from '@angular/core';
import { BaseNavigation, KbiNavigationNode } from '../../services/navigation';
import { ApplicationService, KbiSectionModel, BuildingApplicationStatus, KbiModel } from '../../services/application.service';
import { CheckBeforeStartComponent } from 'src/app/features/kbi/check-before-start/check-before-start.component';
import { EvacuationStrategyComponent } from 'src/app/features/kbi/1-fire/evacuation-strategy/evacuation-strategy.component';
import { ProvisionsEquipmentComponent } from 'src/app/features/kbi/1-fire/provisions-equipment/provisions-equipment.component';
import { FireSmokeProvisionsComponent } from 'src/app/features/kbi/1-fire/fire-smoke-provisions/fire-smoke-provisions.component';
import { FireSmokeProvisionLocationsComponent } from 'src/app/features/kbi/1-fire/fire-smoke-provision-locations/fire-smoke-provision-locations.component';
import { LiftsComponent } from 'src/app/features/kbi/1-fire/lifts/lifts.component';
import { ResidentialUnitFrontDoorsFireResistanceComponent } from 'src/app/features/kbi/1-fire/residential-unit-front-doors-fire-resistance/residential-unit-front-doors-fire-resistance.component';
import { FireDoorsCommonComponent } from 'src/app/features/kbi/1-fire/fire-doors-common/fire-doors-common.component';
import { EnergyTypeComponent } from 'src/app/features/kbi/2-energy/energy-type/energy-type.component';
import { OnSiteEnergyGenerationComponent } from 'src/app/features/kbi/2-energy/on-site-energy-generation/on-site-energy-generation.component';
import { TotalStaircasesComponent } from 'src/app/features/kbi/5-staircases/total-staircases/total-staircases.component';
import { BuildingStructureTypeComponent } from 'src/app/features/kbi/3-structure/building-structure-type/building-structure-type.component';
import { RoofTypeComponent } from 'src/app/features/kbi/4-roof/roof-type/roof-type.component';
import { InsulationLayerComponent } from 'src/app/features/kbi/4-roof/insulation-layer/insulation-layer.component';
import { RoofMaterialComponent } from 'src/app/features/kbi/4-roof/roof-material/roof-material.component';
import { WallsAcmComponent } from './6-walls/walls-acm/walls-acm.component';
import { WallsHplComponent } from './6-walls/walls-hpl/walls-hpl.component';
import { ExternalWallMaterialsComponent } from './6-walls/external-wall-materials/external-wall-materials.component';
import { EstimatedPercentageComponent } from './6-walls/estimated-percentage/estimated-percentage.component';
import { EnergySupplyComponent } from './2-energy/energy-supply/energy-supply.component';
import { ExternalWallInsulationTypeComponent } from './6-walls/external-wall-insulation-type/external-wall-insulation-type.component';
import { ExternalWallInsulationPercentageComponent } from './6-walls/external-wall-insulation-percentage/external-wall-insulation-percentage.component';
import { FeatureMaterialsOutsideComponent } from './6-walls/feature-materials-outside/feature-materials-outside.component';
import { PrimaryUseOfBuildingComponent } from './7-building-use/primary-use-of-building/primary-use-of-building.component';
import { SecondaryUseBuildingComponent } from './7-building-use/secondary-use-building/secondary-use-building.component';
import { FloorsBelowGroundLevelComponent } from './7-building-use/floors-below-ground-level/floors-below-ground-level.component';
import { ChangePrimaryUseComponent } from './7-building-use/change-primary-use/change-primary-use.component';
import { PrimaryUseBuildingBelowGroundLevelComponent } from './7-building-use/primary-use-building-below-ground-level/primary-use-building-below-ground-level.component';

import { KbiFireModule } from './1-fire/kbi.fire.module';
import { KbiEnergyModule } from './2-energy/kbi.energy.module';
import { KbiStructureModule } from './3-structure/kbi.structure.module';
import { KbiRoofModule } from './4-roof/kbi.roof.module';
import { KbiStaircasesModule } from './5-staircases/kbi.staircases.module';
import { KbiWallsModule } from './6-walls/kbi.walls.module';
import { KbiBuildingUseModule } from './7-building-use/kbi.building-use.module';
import { PreviousUseBuildingComponent } from './7-building-use/previous-use-building/previous-use-building.component';
import { CertificatesYearChangeComponent } from './7-building-use/certificates-year-change/certificates-year-change.component';
import { UndergoneBuildingMaterialChangesComponent } from './7-building-use/undergone-building-material-changes/undergone-building-material-changes.component';
import { MostRecentChangeComponent } from './7-building-use/most-recent-material-change/most-recent-material-change.component';
import { YearMostRecentChangeComponent } from './7-building-use/year-most-recent-change/year-most-recent-change.component';
import { AddedFloorsTypeComponent } from './7-building-use/added-floors-type/added-floors-type.component';
import { StructureConnectionsComponent } from './8-connections/structure-connections/structure-connections.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { OtherHighRiseBuildingConnectionsComponent } from './8-connections/other-high-rise-building-connections/other-high-rise-building-connections.component';
import { HowOtherHighRiseBuildingsConnectedComponent } from './8-connections/how-other-high-rise-buildings-connected/how-other-high-rise-buildings-connected.component';
import { OtherBuildingConnectionsComponent } from './8-connections/other-building-connections/other-building-connections.component';
import { HowOtherBuildingsConnectedComponent } from './8-connections/how-other-buildings-connected/how-other-buildings-connected.component';
import { ConnectionsCheckAnswerComponent } from './8-connections/connections-check-answer/connections-check-answer.component';
import { DeclarationComponent } from './9-submit/declaration/declaration.component';
import { ConfirmComponent } from './9-submit/confirm/confirm.component';
import { KbiConnectionsModule } from './8-connections/kbi.connections.module';
import { KbiSubmitModule } from './9-submit/kbi.submit.module';
import { KbiCheckAnswersModule } from './check-answers-building-information/kbi.check-answers-building-information.module';
import { SectionCheckAnswersComponent } from '../application/building-summary/check-answers/check-answers.component';
import { BuildingInformationCheckAnswersComponent } from './check-answers-building-information/check-answers-building-information.component';

@Injectable()
export class KbiNavigation extends BaseNavigation {

  constructor(private applicationService: ApplicationService) {
    super();
  }

  private kbiConfirmNavigationNode = new KbiConfirmNavigationNode(this.applicationService);
  private kbiDeclarationNavigationNode = new KbiDeclarationNavigationNode(this.applicationService, this.kbiConfirmNavigationNode);

  public getNextSubmitRoute() {
    return this.kbiDeclarationNavigationNode.getNextRoute(this.applicationService.model.Kbi!, 0)
  }

  private connectionsCheckAnswerNavigationNode = new ConnectionsCheckAnswerNavigationNode(this.applicationService);
  private howOtherBuildingsConnectedNavigationNode = new HowOtherBuildingsConnectedNavigationNode(this.connectionsCheckAnswerNavigationNode);
  private otherBuildingConnectionsNavigationNode = new OtherBuildingConnectionsNavigationNode(this.howOtherBuildingsConnectedNavigationNode, this.connectionsCheckAnswerNavigationNode);
  private howOtherHighRiseBuildingsConnectedNavigationNode = new HowOtherHighRiseBuildingsConnectedNavigationNode(this.otherBuildingConnectionsNavigationNode);
  private otherHighRiseBuildingConnectionsNavigationNode = new OtherHighRiseBuildingConnectionsNavigationNode(this.howOtherHighRiseBuildingsConnectedNavigationNode, this.otherBuildingConnectionsNavigationNode);
  private structureConnectionsNavigationNode = new StructureConnectionsNavigationNode(this.otherHighRiseBuildingConnectionsNavigationNode);

  public getNextConnectionRoute() {
    return this.structureConnectionsNavigationNode.getNextRoute(this.applicationService.model.Kbi!, 0);
  }

  private buildingInformationCheckAnswersNavigationNode = new BuildingInformationCheckAnswersNavigationNode();
  private yearMostRecentChangeNavigationNode = new YearMostRecentChangeNavigationNode(this.buildingInformationCheckAnswersNavigationNode);
  private mostRecentChangeNavigationNode = new MostRecentChangeNavigationNode(this.yearMostRecentChangeNavigationNode, this.buildingInformationCheckAnswersNavigationNode);
  private addedFloorsTypeNavigationNode = new AddedFloorsTypeNavigationNode(this.yearMostRecentChangeNavigationNode, this.mostRecentChangeNavigationNode);
  private undergoneBuildingMaterialChangesNavigationNode = new UndergoneBuildingMaterialChangesNavigationNode(this.addedFloorsTypeNavigationNode, this.yearMostRecentChangeNavigationNode, this.mostRecentChangeNavigationNode, this.buildingInformationCheckAnswersNavigationNode);
  private certificatesYearChangeNavigationNode = new CertificatesYearChangeNavigationNode(this.undergoneBuildingMaterialChangesNavigationNode);
  private previousUseBuildingNavigationNode = new PreviousUseBuildingNavigationNode(this.certificatesYearChangeNavigationNode);
  private changePrimaryUseNavigationNode = new ChangePrimaryUseNavigationNode(this.previousUseBuildingNavigationNode, this.undergoneBuildingMaterialChangesNavigationNode);
  private primaryUseBuildingBelowGroundLevelNavigationNode = new PrimaryUseBuildingBelowGroundLevelNavigationNode(this.changePrimaryUseNavigationNode, this.undergoneBuildingMaterialChangesNavigationNode);
  private floorsBelowGroundLevelNavigationNode = new FloorsBelowGroundLevelNavigationNode(this.primaryUseBuildingBelowGroundLevelNavigationNode, this.changePrimaryUseNavigationNode);
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
  private fireSmokeProvisionLocationsNavigationNode = new FireSmokeProvisionLocationsNavigationNode(this.liftsNavigationNode, this.applicationService);
  private fireSmokeProvisionsNavigationNode = new FireSmokeProvisionsNavigationNode(this.fireSmokeProvisionLocationsNavigationNode, this.liftsNavigationNode);
  private provisionsEquipmentNavigationNode = new ProvisionsEquipmentNavigationNode(this.fireSmokeProvisionsNavigationNode);
  private evacuationStrategyNavigationNode = new EvacuationStrategyNavigationNode(this.provisionsEquipmentNavigationNode);
  private checkBeforeStartNavigationNode = new CheckBeforeStartNavigationNode(this.applicationService, this.evacuationStrategyNavigationNode);

  override getNextRoute(sectionIndex?: number): string {
    if (this.applicationService.model.Kbi?.KbiSections == null || this.applicationService.model.Kbi!.KbiSections.length == 0) {
      return CheckBeforeStartComponent.route;
    }

    let kbiSection = this.applicationService.model.Kbi!.KbiSections[sectionIndex!];
    let sectionRoute = this.checkBeforeStartNavigationNode.getNextRoute(kbiSection, sectionIndex!);
    return `${sectionRoute}`;
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
    if (!kbi.Fire.StrategyEvacuateBuilding) {
      return `${KbiFireModule.baseRoute}/${EvacuationStrategyComponent.route}`;
    }
    return this.provisionsEquipmentNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }

}

class ProvisionsEquipmentNavigationNode extends KbiNavigationNode {
  constructor(private fireSmokeProvisionsNavigationNode: FireSmokeProvisionsNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Fire.ProvisionsEquipment || kbi.Fire.ProvisionsEquipment.length == 0) {
      return `${KbiFireModule.baseRoute}/${ProvisionsEquipmentComponent.route}`;
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
    if (!kbi.Fire.FireSmokeProvisions || kbi.Fire.FireSmokeProvisions!.length == 0) {
      return `${KbiFireModule.baseRoute}/${FireSmokeProvisionsComponent.route}`;
    }

    if (kbi.Fire.FireSmokeProvisions!.length == 1 && kbi.Fire.FireSmokeProvisions![0] === 'none') {
      return this.liftsNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }

    return this.fireSmokeProvisionLocationsNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class FireSmokeProvisionLocationsNavigationNode extends KbiNavigationNode {
  constructor(private liftsNavigationNode: LiftsNavigationNode,
    private applicationService: ApplicationService) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Fire.FireSmokeProvisionLocations || Object.keys(kbi.Fire.FireSmokeProvisionLocations).length == 0) {
      return FireSmokeProvisionLocationsComponent.route;
    }

    if (kbi.Fire.FireSmokeProvisions!.some(x => !kbi!.Fire.FireSmokeProvisionLocations![x] || kbi!.Fire.FireSmokeProvisionLocations![x].length == 0)) {
      let nextEquipment = this.applicationService.currentKbiSection?.Fire.FireSmokeProvisions!.find(x => !this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![x] || this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![x].length == 0);
      return `${KbiFireModule.baseRoute}/${FireSmokeProvisionLocationsComponent.route}?equipment=${nextEquipment}`;
    }

    return this.liftsNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class LiftsNavigationNode extends KbiNavigationNode {
  constructor(private residentialUnitFrontDoorsFireResistanceNavigationNode: ResidentialUnitFrontDoorsFireResistanceNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Fire.Lifts || kbi.Fire.Lifts.length == 0) {
      return `${KbiFireModule.baseRoute}/${LiftsComponent.route}`;
    }
    return this.residentialUnitFrontDoorsFireResistanceNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class ResidentialUnitFrontDoorsFireResistanceNavigationNode extends KbiNavigationNode {
  constructor(private fireDoorsCommonNavigationNode: FireDoorsCommonNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Fire.ResidentialUnitFrontDoors || !kbi.Fire.ResidentialUnitFrontDoors.NoFireResistance
      || !kbi.Fire.ResidentialUnitFrontDoors.ThirtyMinsFireResistance
      || !kbi.Fire.ResidentialUnitFrontDoors.SixtyMinsFireResistance
      || !kbi.Fire.ResidentialUnitFrontDoors.HundredTwentyMinsFireResistance
      || !kbi.Fire.ResidentialUnitFrontDoors.NotKnownFireResistance) {
      return `${KbiFireModule.baseRoute}/${ResidentialUnitFrontDoorsFireResistanceComponent.route}`;
    }
    return this.fireDoorsCommonNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class FireDoorsCommonNavigationNode extends KbiNavigationNode {
  constructor(private energyTypeStorageNavigationNode: EnergyTypeStorageNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Fire.FireDoorsCommon || !kbi.Fire.FireDoorsCommon.FireDoorUnknown
      || !kbi.Fire.FireDoorsCommon.FireDoorThirtyMinute
      || !kbi.Fire.FireDoorsCommon.FireDoorSixtyMinute
      || !kbi.Fire.FireDoorsCommon.FireDoorHundredTwentyMinute) {
      return `${KbiFireModule.baseRoute}/${FireDoorsCommonComponent.route}`;
    }
    return this.energyTypeStorageNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class EnergyTypeStorageNavigationNode extends KbiNavigationNode {
  constructor(private onSiteEnergyGenerationNavigationNode: OnSiteEnergyGenerationNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Energy.EnergyTypeStorage || kbi.Energy.EnergyTypeStorage.length == 0) {
      return `${KbiEnergyModule.baseRoute}/${EnergyTypeComponent.route}`;
    }
    return this.onSiteEnergyGenerationNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class OnSiteEnergyGenerationNavigationNode extends KbiNavigationNode {
  constructor(private energySupplyNavigationNode: EnergySupplyNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Energy.OnsiteEnergyGeneration || kbi.Energy.OnsiteEnergyGeneration.length == 0) {
      return `${KbiEnergyModule.baseRoute}/${OnSiteEnergyGenerationComponent.route}`;
    }
    return this.energySupplyNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class EnergySupplyNavigationNode extends KbiNavigationNode {
  constructor(private buildingStructureTypeNavigationNode: BuildingStructureTypeNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Energy.EnergySupply || kbi.Energy.EnergySupply.length == 0) {
      return `${KbiEnergyModule.baseRoute}/${EnergySupplyComponent.route}`;
    }
    return this.buildingStructureTypeNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class BuildingStructureTypeNavigationNode extends KbiNavigationNode {
  constructor(private roofTypeNavigationNode: RoofTypeNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.BuildingStructure.BuildingStructureType || kbi.BuildingStructure.BuildingStructureType.length == 0) {
      return `${KbiStructureModule.baseRoute}/${BuildingStructureTypeComponent.route}`;
    }
    return this.roofTypeNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class RoofTypeNavigationNode extends KbiNavigationNode {
  constructor(private insulationLayerNavigationNode: InsulationLayerNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Roof.RoofType) {
      return `${KbiRoofModule.baseRoute}/${RoofTypeComponent.route}`;
    }
    return this.insulationLayerNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class InsulationLayerNavigationNode extends KbiNavigationNode {
  constructor(private roofMaterialNavigationNode: RoofMaterialNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Roof.RoofInsulation) {
      return `${KbiRoofModule.baseRoute}/${InsulationLayerComponent.route}`;
    }
    return this.roofMaterialNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class RoofMaterialNavigationNode extends KbiNavigationNode {
  constructor(private totalStaircasesNavigationNode: TotalStaircasesNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Roof.RoofMaterial) {
      return `${KbiRoofModule.baseRoute}/${RoofMaterialComponent.route}`;
    }
    return this.totalStaircasesNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class TotalStaircasesNavigationNode extends KbiNavigationNode {
  constructor(private externalWallMaterialsNavigationNode: ExternalWallMaterialsNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Staircases.TotalNumberStaircases || !kbi.Staircases.InternalStaircasesAllFloors) {
      return `${KbiStaircasesModule.baseRoute}/${TotalStaircasesComponent.route}`;
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
    if (!kbi.Walls.ExternalWallMaterials || kbi.Walls.ExternalWallMaterials.length == 0) {
      return `${KbiWallsModule.baseRoute}/${ExternalWallMaterialsComponent.route}`;
    } else if (kbi.Walls.ExternalWallMaterials!.indexOf('acm') > -1) {
      return this.wallAcmNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    } else if (kbi.Walls.ExternalWallMaterials!.indexOf('hpl') > -1) {
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
    if (!kbi.Walls.WallACM) {
      return `${KbiWallsModule.baseRoute}/${WallsAcmComponent.route}`;
    } else if (kbi.Walls.ExternalWallMaterials!.indexOf('hpl') > -1) {
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
    if (!kbi.Walls.WallHPL) {
      return `${KbiWallsModule.baseRoute}/${WallsHplComponent.route}`;
    }
    return this.estimatedPercentageNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class EstimatedPercentageNavigationNode extends KbiNavigationNode {
  constructor(private externalWallInsulationTypeNavigationNode: ExternalWallInsulationTypeNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Walls.ExternalWallMaterialsPercentage || Object.keys(kbi.Walls.ExternalWallMaterialsPercentage).length == 0
      || kbi.Walls.ExternalWallMaterials!.some(x => !kbi!.Walls.ExternalWallMaterialsPercentage![x] || kbi!.Walls.ExternalWallMaterialsPercentage![x].length == 0)) {
      return `${KbiWallsModule.baseRoute}/${EstimatedPercentageComponent.route}`;
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
    if (!kbi.Walls.ExternalWallInsulation || !kbi.Walls.ExternalWallInsulation.CheckBoxSelection || kbi.Walls.ExternalWallInsulation.CheckBoxSelection?.length == 0 || this.isOtherOptionSelectedButNotCompleted(kbi)) {
      return `${KbiWallsModule.baseRoute}/${ExternalWallInsulationTypeComponent.route}`;
    } else if (kbi.Walls.ExternalWallInsulation.CheckBoxSelection.length == 1 && kbi.Walls.ExternalWallInsulation.CheckBoxSelection.includes('none')) {
      return this.externalFeaturesNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
    return this.externalWallInsulationPercentageNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }

  private isOtherOptionSelectedButNotCompleted(kbi: KbiSectionModel) {
    return kbi.Walls.ExternalWallInsulation!.CheckBoxSelection!.length > 0
      && kbi.Walls.ExternalWallInsulation!.CheckBoxSelection!.includes("other")
      && (!kbi.Walls.ExternalWallInsulation!.OtherValue || kbi.Walls.ExternalWallInsulation!.OtherValue.length == 0);
  }
}

class ExternalWallInsulationPercentageNavigationNode extends KbiNavigationNode {
  constructor(private externalFeaturesNavigationNode: ExternalFeaturesNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Walls.ExternalWallInsulationPercentages || Object.keys(kbi.Walls.ExternalWallInsulationPercentages).length == 0
      || kbi.Walls.ExternalWallInsulation?.CheckBoxSelection?.length != Object.keys(kbi.Walls.ExternalWallInsulationPercentages).length
      || kbi.Walls.ExternalWallInsulation?.CheckBoxSelection?.some(x => !kbi.Walls.ExternalWallInsulationPercentages![x])) {
      return `${KbiWallsModule.baseRoute}/${ExternalWallInsulationPercentageComponent.route}`;
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
    if (!kbi.Walls.FeatureMaterialsOutside || Object.keys(kbi.Walls.FeatureMaterialsOutside).length == 0) {
      return FeatureMaterialsOutsideComponent.route;
    } else if (Object.keys(kbi.Walls.FeatureMaterialsOutside).some(x => !kbi.Walls.FeatureMaterialsOutside![x] || kbi.Walls.FeatureMaterialsOutside![x].length == 0)) {

      let nextFeature = '';
      for (let externalFeature of kbi.Walls.ExternalFeatures!) {
        let featureMaterials = kbi!.Walls.FeatureMaterialsOutside![externalFeature];
        if (Object.keys(kbi.Walls.FeatureMaterialsOutside!).includes(externalFeature) && featureMaterials?.length == 0) {
          nextFeature = externalFeature;
          break;
        }
      }

      return `${KbiWallsModule.baseRoute}/${FeatureMaterialsOutsideComponent.route}?feature=${nextFeature}`;
    }

    return this.primaryUseBuildingNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class FeaturesMaterialsOutsideNavigationNode extends KbiNavigationNode {
  constructor(private primaryUseBuildingNavigationNode: PrimaryUseBuildingNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.Walls.FeatureMaterialsOutside || Object.keys(kbi.Walls.FeatureMaterialsOutside).length == 0 || Object.keys(kbi.Walls.FeatureMaterialsOutside).some(x => !kbi.Walls.FeatureMaterialsOutside![x] || kbi.Walls.FeatureMaterialsOutside![x].length == 0)) {
      let nextFeature = kbi.Walls.ExternalFeatures!.find(x => !kbi!.Walls.FeatureMaterialsOutside![x] || kbi!.Walls.FeatureMaterialsOutside![x].length == 0);
      return `${KbiWallsModule.baseRoute}/${FeatureMaterialsOutsideComponent.route}?feature=${nextFeature}`;
    }
    return this.primaryUseBuildingNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class PrimaryUseBuildingNavigationNode extends KbiNavigationNode {
  constructor(private secondaryUseBuildingNavigationNode: SecondaryUseBuildingNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.BuildingUse.PrimaryUseOfBuilding || kbi.BuildingUse.PrimaryUseOfBuilding.length == 0) {
      return `${KbiBuildingUseModule.baseRoute}/${PrimaryUseOfBuildingComponent.route}`;
    }
    return this.secondaryUseBuildingNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class SecondaryUseBuildingNavigationNode extends KbiNavigationNode {
  constructor(private floorsBelowGroundLevelNavigationNode: FloorsBelowGroundLevelNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.BuildingUse.SecondaryUseBuilding || kbi.BuildingUse.SecondaryUseBuilding.length == 0) {
      return `${KbiBuildingUseModule.baseRoute}/${SecondaryUseBuildingComponent.route}`;
    }
    return this.floorsBelowGroundLevelNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class FloorsBelowGroundLevelNavigationNode extends KbiNavigationNode {
  constructor(private primaryUseBuildingBelowGroundLevelNavigationNode: PrimaryUseBuildingBelowGroundLevelNavigationNode,
    private changePrimaryUseNavigationNode: ChangePrimaryUseNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.BuildingUse.FloorsBelowGroundLevel) {
      return `${KbiBuildingUseModule.baseRoute}/${FloorsBelowGroundLevelComponent.route}`;
    } else if (kbi.BuildingUse.FloorsBelowGroundLevel >= 1) {
      return this.primaryUseBuildingBelowGroundLevelNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    } else if (kbi.BuildingUse.FloorsBelowGroundLevel == 0 && kbi.BuildingUse.PrimaryUseOfBuilding === "residential_dwellings") {
      return this.changePrimaryUseNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
    return `${KbiBuildingUseModule.baseRoute}/${FloorsBelowGroundLevelComponent.route}`;
  }
}

class PrimaryUseBuildingBelowGroundLevelNavigationNode extends KbiNavigationNode {
  constructor(private changePrimaryUseNavigationNode: ChangePrimaryUseNavigationNode, private undergoneBuildingMaterialChangesNavigationNode: UndergoneBuildingMaterialChangesNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.BuildingUse.PrimaryUseBuildingBelowGroundLevel || kbi.BuildingUse.PrimaryUseBuildingBelowGroundLevel.length == 0) {
      return `${KbiBuildingUseModule.baseRoute}/${PrimaryUseBuildingBelowGroundLevelComponent.route}`;
    } else if (kbi.BuildingUse.PrimaryUseOfBuilding === "residential_dwellings") {
      return this.changePrimaryUseNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    } else {
      return this.undergoneBuildingMaterialChangesNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
  }
}

class ChangePrimaryUseNavigationNode extends KbiNavigationNode {
  constructor(private previousUseBuildingNavigationNode: PreviousUseBuildingNavigationNode, private undergoneBuildingMaterialChangesNavigationNode: UndergoneBuildingMaterialChangesNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.BuildingUse.ChangePrimaryUse || kbi.BuildingUse.ChangePrimaryUse.length == 0) {
      return `${KbiBuildingUseModule.baseRoute}/${ChangePrimaryUseComponent.route}`;
    } else if (kbi.BuildingUse.ChangePrimaryUse === "yes") {
      return this.previousUseBuildingNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
    return this.undergoneBuildingMaterialChangesNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class PreviousUseBuildingNavigationNode extends KbiNavigationNode {
  constructor(private certificatesYearChangeNavigationNode: CertificatesYearChangeNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.BuildingUse.PreviousUseBuilding || kbi.BuildingUse.PreviousUseBuilding.length == 0) {
      return `${KbiBuildingUseModule.baseRoute}/${PreviousUseBuildingComponent.route}`;
    }
    return this.certificatesYearChangeNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class CertificatesYearChangeNavigationNode extends KbiNavigationNode {
  constructor(private undergoneBuildingMaterialChangesNavigationNode: UndergoneBuildingMaterialChangesNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.BuildingUse.YearChangeInUse) {
      return `${KbiBuildingUseModule.baseRoute}/${CertificatesYearChangeComponent.route}`;
    }
    return this.undergoneBuildingMaterialChangesNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class UndergoneBuildingMaterialChangesNavigationNode extends KbiNavigationNode {

  constructor(private addedFloorsTypeNavigationNode: AddedFloorsTypeNavigationNode,
    private yearMostRecentChangeNavigationNode: YearMostRecentChangeNavigationNode,
    private mostRecentChangeNavigationNode: MostRecentChangeNavigationNode,
    private buildingInformationCheckAnswersNavigationNode: BuildingInformationCheckAnswersNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.BuildingUse.UndergoneBuildingMaterialChanges || kbi.BuildingUse.UndergoneBuildingMaterialChanges.length == 0) {
      return `${KbiBuildingUseModule.baseRoute}/${UndergoneBuildingMaterialChangesComponent.route}`;
    } else if (kbi.BuildingUse.UndergoneBuildingMaterialChanges.length == 1 && kbi.BuildingUse.UndergoneBuildingMaterialChanges[0] === "none") {
      return this.buildingInformationCheckAnswersNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    } else if (kbi.BuildingUse.UndergoneBuildingMaterialChanges.length > 1 && !kbi.BuildingUse.UndergoneBuildingMaterialChanges?.some(x => x == 'floors_added' || x == 'none' || x == 'unknown')) {
      return this.mostRecentChangeNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
    else if (kbi.BuildingUse.UndergoneBuildingMaterialChanges.length == 1 && !kbi.BuildingUse.UndergoneBuildingMaterialChanges?.some(x => x == 'floors_added' || x == 'none' || x == 'unknown')) {
      if (kbi.BuildingUse.MostRecentMaterialChange && !kbi.BuildingUse.UndergoneBuildingMaterialChanges.includes(kbi.BuildingUse.MostRecentMaterialChange)) {
        kbi.BuildingUse.MostRecentMaterialChange = kbi.BuildingUse.UndergoneBuildingMaterialChanges![0];
      }
      return this.yearMostRecentChangeNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
    else if (kbi.BuildingUse.UndergoneBuildingMaterialChanges!.includes('floors_added')) {
      kbi.BuildingUse.MostRecentMaterialChange = kbi.BuildingUse.UndergoneBuildingMaterialChanges![0];
      return this.addedFloorsTypeNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }

    return `${KbiBuildingUseModule.baseRoute}/${UndergoneBuildingMaterialChangesComponent.route}`;
  }

}

class AddedFloorsTypeNavigationNode extends KbiNavigationNode {

  constructor(private yearMostRecentChangeNavigationNode: YearMostRecentChangeNavigationNode, private mostRecentChangeNavigationNode: MostRecentChangeNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {

    if (!kbi.BuildingUse.AddedFloorsType) {
      return `${KbiBuildingUseModule.baseRoute}/${AddedFloorsTypeComponent.route}`;
    }
    else if (kbi.BuildingUse.UndergoneBuildingMaterialChanges!.length > 1) {
      return this.mostRecentChangeNavigationNode.getNextRoute(kbi, kbiSectionIndex);

    }
    else {
      return this.yearMostRecentChangeNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
  }
}

class MostRecentChangeNavigationNode extends KbiNavigationNode {

  constructor(private yearMostRecentChangeNavigationNode: YearMostRecentChangeNavigationNode,
    private buildingInformationCheckAnswersNavigationNode: BuildingInformationCheckAnswersNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.BuildingUse.MostRecentMaterialChange) {
      return `${KbiBuildingUseModule.baseRoute}/${MostRecentChangeComponent.route}`;
    }
    else if (kbi.BuildingUse.MostRecentMaterialChange === "unknown") {
      return this.buildingInformationCheckAnswersNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
    else {
      return this.yearMostRecentChangeNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
  }

}

class YearMostRecentChangeNavigationNode extends KbiNavigationNode {

  constructor(private buildingInformationCheckAnswersNavigationNode: BuildingInformationCheckAnswersNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    return this.buildingInformationCheckAnswersNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }

}

class BuildingInformationCheckAnswersNavigationNode extends KbiNavigationNode {
  constructor() {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    return `${KbiCheckAnswersModule.baseRoute}/${BuildingInformationCheckAnswersComponent.route}`;
  }
}

class StructureConnectionsNavigationNode extends KbiNavigationNode {

  constructor(private otherHighRiseBuildingConnectionsNavigationNode: OtherHighRiseBuildingConnectionsNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiModel, kbiSectionIndex: number): string {
    if (kbi.KbiSections.length > 1 && (!kbi.Connections?.StructureConnections || kbi.Connections.StructureConnections.length == 0)) {
      return `${KbiConnectionsModule.baseRoute}/${StructureConnectionsComponent.route}`;
    }

    return this.otherHighRiseBuildingConnectionsNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }

}

class OtherHighRiseBuildingConnectionsNavigationNode extends KbiNavigationNode {

  constructor(private howOtherHighRiseBuildingsConnectedNavigationNode: HowOtherHighRiseBuildingsConnectedNavigationNode,
    private otherBuildingConnectionsNavigationNode: OtherBuildingConnectionsNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiModel, kbiSectionIndex: number): string {
    if (!kbi.Connections?.OtherHighRiseBuildingConnections || !FieldValidations.IsNotNullOrWhitespace(kbi.Connections?.OtherHighRiseBuildingConnections)) {
      return `${KbiConnectionsModule.baseRoute}/${OtherHighRiseBuildingConnectionsComponent.route}`;
    } else if (kbi.Connections.OtherHighRiseBuildingConnections === "yes") {
      return this.howOtherHighRiseBuildingsConnectedNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
    return this.otherBuildingConnectionsNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }

}

class HowOtherHighRiseBuildingsConnectedNavigationNode extends KbiNavigationNode {

  constructor(private otherBuildingConnectionsNavigationNode: OtherBuildingConnectionsNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiModel, kbiSectionIndex: number): string {
    if (!kbi.Connections.HowOtherHighRiseBuildingAreConnected || kbi.Connections.HowOtherHighRiseBuildingAreConnected.length == 0) {
      return `${KbiConnectionsModule.baseRoute}/${HowOtherHighRiseBuildingsConnectedComponent.route}`;
    }
    return this.otherBuildingConnectionsNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }

}

class OtherBuildingConnectionsNavigationNode extends KbiNavigationNode {

  constructor(private howOtherBuildingsConnectedNavigationNode: HowOtherBuildingsConnectedNavigationNode,
    private connectionCheckAnswersNavigationNode: ConnectionsCheckAnswerNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiModel, kbiSectionIndex: number): string {
    if (!kbi.Connections.OtherBuildingConnections || !FieldValidations.IsNotNullOrWhitespace(kbi.Connections.OtherBuildingConnections)) {
      return `${KbiConnectionsModule.baseRoute}/${OtherBuildingConnectionsComponent.route}`;
    } else if (kbi.Connections.OtherBuildingConnections === "yes") {
      return this.howOtherBuildingsConnectedNavigationNode.getNextRoute(kbi, kbiSectionIndex);
    }
    return this.connectionCheckAnswersNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }

}

class HowOtherBuildingsConnectedNavigationNode extends KbiNavigationNode {

  constructor(private connectionCheckAnswersNavigationNode: ConnectionsCheckAnswerNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiModel, kbiSectionIndex: number): string {
    if (!kbi.Connections.HowOtherBuildingAreConnected || kbi.Connections.HowOtherBuildingAreConnected.length == 0) {
      return `${KbiConnectionsModule.baseRoute}/${HowOtherBuildingsConnectedComponent.route}`;
    }
    return this.connectionCheckAnswersNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }

}

class ConnectionsCheckAnswerNavigationNode extends KbiNavigationNode {

  constructor(private applicationService: ApplicationService) {
    super();
  }

  override getNextRoute(kbi: KbiModel, kbiSectionIndex: number): string {
    return `${KbiConnectionsModule.baseRoute}/${ConnectionsCheckAnswerComponent.route}`;
  }

  private canContinue(): boolean {
    let canContinue = true;

    canContinue &&= !!this.applicationService.currentKbiModel?.Connections?.StructureConnections && this.applicationService.currentKbiModel?.Connections?.StructureConnections.length > 0;

    canContinue &&= FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentKbiModel?.Connections?.OtherHighRiseBuildingConnections);

    if (this.applicationService.currentKbiModel?.Connections?.OtherHighRiseBuildingConnections === 'yes') canContinue &&= !!this.applicationService.currentKbiModel?.Connections?.HowOtherHighRiseBuildingAreConnected && this.applicationService.currentKbiModel?.Connections?.HowOtherHighRiseBuildingAreConnected.length > 0;

    canContinue &&= FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentKbiModel?.Connections?.OtherBuildingConnections);

    if (this.applicationService.currentKbiModel?.Connections?.OtherBuildingConnections === 'yes') canContinue &&= !!this.applicationService.currentKbiModel?.Connections?.HowOtherBuildingAreConnected && this.applicationService.currentKbiModel?.Connections?.HowOtherBuildingAreConnected.length > 0;

    return canContinue;
  }

}

class KbiDeclarationNavigationNode extends KbiNavigationNode {

  constructor(private applicationService: ApplicationService, private kbiConfirmNavigationNode: KbiConfirmNavigationNode) {
    super();
  }

  override getNextRoute(kbi: KbiModel, kbiSectionIndex: number): string {
    if (!this.containsFlag(BuildingApplicationStatus.KbiSubmitInProgress)) {
      return `${KbiSubmitModule.baseRoute}/${DeclarationComponent.route}`;
    }
    return this.kbiConfirmNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }

  private containsFlag(flag: BuildingApplicationStatus) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

}

class KbiConfirmNavigationNode extends KbiNavigationNode {

  constructor(private applicationService: ApplicationService) {
    super();
  }

  override getNextRoute(kbi: KbiModel, kbiSectionIndex: number): string {
    if (!this.containsFlag(BuildingApplicationStatus.KbiSubmitComplete)) {
      return `${KbiSubmitModule.baseRoute}/${ConfirmComponent.route}`;
    }
    return `${KbiSubmitModule.baseRoute}/${ConfirmComponent.route}`;
  }

  private containsFlag(flag: BuildingApplicationStatus) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }
}
