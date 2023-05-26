import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukCheckboxComponent, GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { FireSmokeProvisionsComponent } from '../fire-smoke-provisions/fire-smoke-provisions.component';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';

@Component({
  selector: 'hse-provisions-equipment',
  templateUrl: './provisions-equipment.component.html'
})
export class ProvisionsEquipmentComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'provisions-equipment';
  static title: string = "Residential fire and smoke controls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  provisionsEquipmentHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.ProvisionsEquipment) { this.applicationService.currenKbiSection!.ProvisionsEquipment = []; }
    this.errorMessage = `Select the fire and smoke control equipment in the residential units of ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.provisionsEquipmentHasErrors = !this.applicationService.currenKbiSection!.ProvisionsEquipment 
      || this.applicationService.currenKbiSection!.ProvisionsEquipment.length == 0;

    if (this.provisionsEquipmentHasErrors) this.firstCheckboxAnchorId = `heat_detectors-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    
    return !this.provisionsEquipmentHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(FireSmokeProvisionsComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection!.StrategyEvacuateBuilding;
  }
}
