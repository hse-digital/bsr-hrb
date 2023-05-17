import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukCheckboxComponent, GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component'; 
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { RoofTypeComponent } from '../roof-type/roof-type.component';

@Component({
  selector: 'hse-building-structure-type',
  templateUrl: './building-structure-type.component.html'
})
export class BuildingStructureTypeComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'building-structure-type';
  static title: string = "Structure type - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  buildingStructureTypeHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.buildingStructureType) { this.applicationService.currenKbiSection!.buildingStructureType = []; }
    this.errorMessage = `Select the type of structure in ${this.getInfraestructureName()} , or select \'None of these\'`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.buildingStructureTypeHasErrors = !this.applicationService.currenKbiSection!.buildingStructureType 
      || this.applicationService.currenKbiSection!.buildingStructureType.length == 0;

    if (this.buildingStructureTypeHasErrors) this.firstCheckboxAnchorId = `composite_steel_concrete-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    
    return !this.buildingStructureTypeHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(RoofTypeComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!(this.applicationService.currenKbiSection!.energySupply!.length > 0);
  }
}