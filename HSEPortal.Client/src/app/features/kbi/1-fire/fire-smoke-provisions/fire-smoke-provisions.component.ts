import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { FireSmokeProvisionLocationsComponent } from '../fire-smoke-provision-locations/fire-smoke-provision-locations.component';
import { LiftsComponent } from '../lifts/lifts.component';

@Component({
  selector: 'hse-fire-smoke-provisions',
  templateUrl: './fire-smoke-provisions.component.html'
})
export class FireSmokeProvisionsComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'smoke-provisions';
  static title: string = "Common parts fire and smoke controls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  fireSmokeProvisionsHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.Fire.FireSmokeProvisions) { this.applicationService.currenKbiSection!.Fire.FireSmokeProvisions = []; }
    this.errorMessage = `Select the fire and smoke control equipment in the residential common parts of ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.fireSmokeProvisionsHasErrors = !this.applicationService.currenKbiSection!.Fire.FireSmokeProvisions 
      || this.applicationService.currenKbiSection!.Fire.FireSmokeProvisions.length == 0;

    if (this.fireSmokeProvisionsHasErrors) this.firstCheckboxAnchorId = `alarm_heat_smoke-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    
    return !this.fireSmokeProvisionsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if(!this.applicationService.currenKbiSection!.Fire.FireSmokeProvisions?.includes('none')) {
      return navigationService.navigateRelative(FireSmokeProvisionLocationsComponent.route, activatedRoute);  
    }
    return navigationService.navigateRelative(LiftsComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection?.Fire.ProvisionsEquipment 
        && this.applicationService.currenKbiSection!.Fire.ProvisionsEquipment.length > 0;
  }
}