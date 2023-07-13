import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { OnSiteEnergyGenerationComponent } from '../on-site-energy-generation/on-site-energy-generation.component';

@Component({
  selector: 'hse-energy-type',
  templateUrl: './energy-type.component.html'
})
export class EnergyTypeComponent  extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'type';
  static title: string = "Energy storage - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  energyTypeHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if(!this.applicationService.currentKbiSection?.Energy) this.applicationService.currentKbiSection!.Energy = {}
    if (!this.applicationService.currentKbiSection!.Energy.EnergyTypeStorage) { this.applicationService.currentKbiSection!.Energy.EnergyTypeStorage = []; }
    this.errorMessage = `Select the types of energy supply in ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  canContinue(): boolean {
    this.energyTypeHasErrors = !this.applicationService.currentKbiSection!.Energy.EnergyTypeStorage 
      || this.applicationService.currentKbiSection!.Energy.EnergyTypeStorage.length == 0;

    if (this.energyTypeHasErrors) this.firstCheckboxAnchorId = `hydrogen_batteries-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    
    return !this.energyTypeHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(OnSiteEnergyGenerationComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currentKbiSection?.Fire.FireDoorsCommon?.FireDoorThirtyMinute
        && !!this.applicationService.currentKbiSection?.Fire.FireDoorsCommon?.FireDoorSixtyMinute
        && !!this.applicationService.currentKbiSection?.Fire.FireDoorsCommon?.FireDoorHundredTwentyMinute
        && !!this.applicationService.currentKbiSection?.Fire.FireDoorsCommon?.FireDoorUnknown
      }
}
