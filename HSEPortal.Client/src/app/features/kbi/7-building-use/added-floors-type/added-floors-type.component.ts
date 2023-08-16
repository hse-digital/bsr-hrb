import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { MostRecentChangeComponent } from '../most-recent-material-change/most-recent-material-change.component';
import { YearMostRecentChangeComponent } from '../year-most-recent-change/year-most-recent-change.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-added-floors-type',
  templateUrl: './added-floors-type.component.html'
})
export class AddedFloorsTypeComponent extends PageComponent<string[]> {
  static route: string = 'added-floors-type';
  static title: string = "Added floors structure type - Register a high-rise building - GOV.UK";

  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  addedFloorsTypeTypeHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection!.BuildingUse.AddedFloorsType) { this.applicationService.currentKbiSection!.BuildingUse.AddedFloorsType = []; }
    this.errorMessage = `Select structure type for extra floors`;
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.BuildingUse.AddedFloorsType);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.BuildingUse.AddedFloorsType = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.BuildingUse.UndergoneBuildingMaterialChanges
      && this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.length > 0
      && !!this.applicationService.currentKbiSection?.BuildingUse.UndergoneBuildingMaterialChanges.find(x => x === 'floors_added');
  }

  override isValid(): boolean {
    this.addedFloorsTypeTypeHasErrors = !this.model || this.model.length == 0;

    if (this.addedFloorsTypeTypeHasErrors) this.firstCheckboxAnchorId = `composite_steel_concrete-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;

    return !this.addedFloorsTypeTypeHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.length > 1) {
      return this.navigationService.navigateRelative(MostRecentChangeComponent.route, this.activatedRoute);
    }
    else {
      return this.navigationService.navigateRelative(YearMostRecentChangeComponent.route, this.activatedRoute);
    }
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

}
