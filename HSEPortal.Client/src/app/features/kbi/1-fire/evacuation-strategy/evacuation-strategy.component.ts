import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { ProvisionsEquipmentComponent } from '../provisions-equipment/provisions-equipment.component';
import { KbiService } from 'src/app/services/kbi.service';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-evacuation-strategy',
  templateUrl: './evacuation-strategy.component.html'
})
export class EvacuationStrategyComponent extends PageComponent<string> {
  static route: string = 'evacuation-strategy';
  static title: string = "Evacuation strategy - Register a high-rise building - GOV.UK";

  evacuationStrategyHasErrors = false;
  errorMessage?: string;



  constructor(activatedRoute: ActivatedRoute, private kbiService: KbiService) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if (!this.applicationService.currentKbiSection?.Fire) this.applicationService.currentKbiSection!.Fire = {}
    this.model = this.applicationService.currentKbiSection?.Fire.StrategyEvacuateBuilding;
    this.applicationService.model.Kbi!.SectionStatus[this.applicationService._currentKbiSectionIndex].InProgress = true;
    this.errorMessage = `Select the strategy you use to evacuate the residential part of ${this.getInfraestructureName()}`;

    await this.kbiService.startKbi(this.applicationService.currentKbiSection!);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Fire.StrategyEvacuateBuilding = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.model.Kbi
    && !!this.applicationService.model.Kbi.SectionStatus
    && this.applicationService.model.Kbi.SectionStatus.length > 0
    && (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.KbiCheckBeforeComplete) == BuildingApplicationStatus.KbiCheckBeforeComplete;
  }

  override isValid(): boolean {
    this.evacuationStrategyHasErrors = !this.model;
    return !this.evacuationStrategyHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(ProvisionsEquipmentComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }
}