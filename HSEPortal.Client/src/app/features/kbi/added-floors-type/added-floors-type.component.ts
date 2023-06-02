import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component'; 
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { RoofTypeComponent } from '../roof-type/roof-type.component';
import { trigger } from '@angular/animations';

@Component({
  selector: 'hse-added-floors-type',
  templateUrl: './added-floors-type.component.html'
})
export class AddedFloorsTypeComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'added-floors-type';
  static title: string = "Added floors structure type - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  addedFloorsTypeTypeHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.BuildingStructureType) { this.applicationService.currenKbiSection!.BuildingStructureType = []; }
    this.errorMessage = `Select structure type for extra floors`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.addedFloorsTypeTypeHasErrors = !this.applicationService.currenKbiSection!.AddedFloorsType 
      || this.applicationService.currenKbiSection!.AddedFloorsType.length == 0;

    if (this.addedFloorsTypeTypeHasErrors) this.firstCheckboxAnchorId = `composite_steel_concrete-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    
    return !this.addedFloorsTypeTypeHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(AddedFloorsTypeComponent.route, activatedRoute);
    //TODO update next page logic for this page
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {

    return !!this.applicationService.currenKbiSection?.UndergoneBuildingMaterialChanges
      && this.applicationService.currenKbiSection!.UndergoneBuildingMaterialChanges!.length > 0
      && !!this.applicationService.currenKbiSection?.UndergoneBuildingMaterialChanges.find(x => x === 'floors_added');
  }
}
