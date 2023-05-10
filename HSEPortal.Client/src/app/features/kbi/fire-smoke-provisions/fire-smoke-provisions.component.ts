import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { EquipmentFireSmokeProvisionsComponent } from './equipment.component';

@Component({
  selector: 'hse-fire-smoke-provisions',
  templateUrl: './fire-smoke-provisions.component.html'
})
export class FireSmokeProvisionsComponent  extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'fire-smoke-provisions';
  static title: string = "Residential fire and smoke controls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(EquipmentFireSmokeProvisionsComponent) equipmentCheckboxGroup?: EquipmentFireSmokeProvisionsComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  fireSmokeProvisionsHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.fireSmokeProvisions) { this.applicationService.currenKbiSection!.fireSmokeProvisions = []; }
    this.errorMessage = `Select the fire and smoke control equipment in the residential units of ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.fireSmokeProvisionsHasErrors = !this.applicationService.currenKbiSection!.fireSmokeProvisions 
      || this.applicationService.currenKbiSection!.fireSmokeProvisions.length == 0;

    if (this.fireSmokeProvisionsHasErrors) this.firstCheckboxAnchorId = `alarm_heat_smoke-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    
    return !this.fireSmokeProvisionsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(FireSmokeProvisionsComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection!.strategyEvacuateBuilding;
  }
}