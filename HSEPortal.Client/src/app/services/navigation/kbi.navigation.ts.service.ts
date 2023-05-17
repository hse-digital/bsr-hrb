import { Injectable } from '@angular/core';
import { BaseNavigation, KbiNavigationNode } from './navigation';
import { ApplicationService, KbiSectionModel, BuildingApplicationStatus } from '../application.service';
import { CheckBeforeStartComponent } from 'src/app/features/kbi/check-before-start/check-before-start.component';
import { EvacuationStrategyComponent } from 'src/app/features/kbi/evacuation-strategy/evacuation-strategy.component';
import { ProvisionsEquipmentComponent } from 'src/app/features/kbi/provisions-equipment/provisions-equipment.component';
import { FireSmokeProvisionsComponent } from 'src/app/features/kbi/fire-smoke-provisions/fire-smoke-provisions.component';
import { FireSmokeProvisionLocationsComponent } from 'src/app/features/kbi/fire-smoke-provision-locations/fire-smoke-provision-locations.component';
import { LiftsComponent } from 'src/app/features/kbi/lifts/lifts.component';
import { ResidentialUnitFrontDoorsFireResistanceComponent } from 'src/app/features/kbi/residential-unit-front-doors-fire-resistance/residential-unit-front-doors-fire-resistance.component';
import { FireDoorsCommonComponent } from 'src/app/features/kbi/fire-doors-common/fire-doors-common.component';

@Injectable()
export class KbiNavigation extends BaseNavigation {

  constructor(private applicationService: ApplicationService) {
    super();
  }

  private fireDoorsCommonNavigationNode = new FireDoorsCommonNavigationNode(this.applicationService);
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
    if (!kbi.strategyEvacuateBuilding) {
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
    if (!kbi.provisionsEquipment || kbi.provisionsEquipment.length == 0) {
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
    if (!kbi.fireSmokeProvisions || kbi.fireSmokeProvisions!.length == 0) {
      return FireSmokeProvisionsComponent.route;
    }

    if (kbi.fireSmokeProvisions!.length == 1 && kbi.fireSmokeProvisions![0] === 'none') {
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
    if (!kbi.fireSmokeProvisionLocations || Object.keys(kbi.fireSmokeProvisionLocations).length == 0) {
      return FireSmokeProvisionLocationsComponent.route;
    }

    if (kbi.fireSmokeProvisions!.some(x => kbi!.fireSmokeProvisionLocations![x].length == 0)) {
      let nextEquipment = kbi.fireSmokeProvisions!.find(x => kbi!.fireSmokeProvisionLocations![x].length == 0);
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
    if (!kbi.lifts || kbi.lifts.length == 0) {
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
    if (!kbi.residentialUnitFrontDoors || !kbi.residentialUnitFrontDoors.noFireResistance
      || !kbi.residentialUnitFrontDoors.thirtyMinsFireResistance
      || !kbi.residentialUnitFrontDoors.sixtyMinsFireResistance
      || !kbi.residentialUnitFrontDoors.hundredTwentyMinsFireResistance
      || !kbi.residentialUnitFrontDoors.notKnownFireResistance) {
      return ResidentialUnitFrontDoorsFireResistanceComponent.route;
    }
    return this.fireDoorsCommonNavigationNode.getNextRoute(kbi, kbiSectionIndex);
  }
}

class FireDoorsCommonNavigationNode extends KbiNavigationNode {
  constructor(private applicationService: ApplicationService) {
    super();
  }

  override getNextRoute(kbi: KbiSectionModel, kbiSectionIndex: number): string {
    if (!kbi.fireDoorsCommon || !kbi.fireDoorsCommon.fireDoorUnknown
      || !kbi.fireDoorsCommon.fireDoorThirtyMinute
      || !kbi.fireDoorsCommon.fireDoorSixtyMinute
      || !kbi.fireDoorsCommon.fireDoorHundredTwentyMinute) {
      return FireDoorsCommonComponent.route;
    }
    return FireDoorsCommonComponent.route;
  }
}