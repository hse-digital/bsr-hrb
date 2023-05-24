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
  selector: 'hse-secondary-use-building',
  templateUrl: './secondary-use-building.component.html'
})
export class SecondaryUseBuildingComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'secondary-uses';
  static title: string = "Secondary uses - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  secondaryUseBuildingHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.SecondaryUseBuilding) { this.applicationService.currenKbiSection!.SecondaryUseBuilding = []; }
    this.errorMessage = `Select the secondary uses for ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.secondaryUseBuildingHasErrors = !this.applicationService.currenKbiSection?.SecondaryUseBuilding 
      || this.applicationService.currenKbiSection!.SecondaryUseBuilding.length == 0;

    if (this.secondaryUseBuildingHasErrors) this.firstCheckboxAnchorId = `assembly_recreation-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    
    return !this.secondaryUseBuildingHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(SecondaryUseBuildingComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
  }

}
