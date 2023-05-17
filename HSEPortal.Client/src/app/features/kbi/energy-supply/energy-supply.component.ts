import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { BuildingStructureTypeComponent } from '../building-structure-type/building-structure-type.component';

@Component({
  selector: 'hse-energy-supply',
  templateUrl: './energy-supply.component.html'
})
export class EnergySupplyComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'energy-supply';
  static title: string = "Energy supplies to - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;


  errorMessage?: string;
  energySupplyHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.energySupply) { this.applicationService.currenKbiSection!.energySupply = []; }
    this.errorMessage = `Select the types of energy supply in ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.energySupplyHasErrors = !this.applicationService.currenKbiSection!.energySupply
      || this.applicationService.currenKbiSection!.energySupply.length == 0;

    return !this.energySupplyHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(BuildingStructureTypeComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    //return !!this.applicationService.currenKbiSection!.strategyEvacuateBuilding; //TODO update with correct access property from #3520 once PR complete
    return true;
  }
}
