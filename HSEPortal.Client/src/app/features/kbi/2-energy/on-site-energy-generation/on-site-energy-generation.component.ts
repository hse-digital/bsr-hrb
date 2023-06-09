import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { EnergySupplyComponent } from '../energy-supply/energy-supply.component';

@Component({
  selector: 'hse-on-site-energy-generation',
  templateUrl: './on-site-energy-generation.component.html'
})
export class OnSiteEnergyGenerationComponent  extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'onsite-generation';
  static title: string = "On site energy generation - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  onsiteEnergyGenerationHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currentKbiSection!.Energy.OnsiteEnergyGeneration) { this.applicationService.currentKbiSection!.Energy.OnsiteEnergyGeneration = []; }
    this.errorMessage = `Select the types of on-site energy generation in  ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.onsiteEnergyGenerationHasErrors = !this.applicationService.currentKbiSection!.Energy.OnsiteEnergyGeneration 
      || this.applicationService.currentKbiSection!.Energy.OnsiteEnergyGeneration.length == 0;

    if (this.onsiteEnergyGenerationHasErrors) this.firstCheckboxAnchorId = `air-ground-source-heat-pumps-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    
    return !this.onsiteEnergyGenerationHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(EnergySupplyComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currentKbiSection?.Energy.EnergyTypeStorage 
        && this.applicationService.currentKbiSection!.Energy.EnergyTypeStorage!.length > 0;
  }
}
