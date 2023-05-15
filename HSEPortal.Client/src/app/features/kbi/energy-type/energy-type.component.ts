import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'hse-energy-type',
  templateUrl: './energy-type.component.html'
})
export class EnergyTypeComponent  extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'energy-type';
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
    if (!this.applicationService.currenKbiSection!.energyTypeStorage) { this.applicationService.currenKbiSection!.energyTypeStorage = []; }
    this.errorMessage = `Select the types of energy supply in ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.energyTypeHasErrors = !this.applicationService.currenKbiSection!.energyTypeStorage 
      || this.applicationService.currenKbiSection!.energyTypeStorage.length == 0;

    if (this.energyTypeHasErrors) this.firstCheckboxAnchorId = `hydrogen_batteries-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    
    return !this.energyTypeHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(EnergyTypeComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection!.strategyEvacuateBuilding;
  }
}
