import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { ApplicationService } from 'src/app/services/application.service';
import { FloorsBelowGroundLevelComponent } from '../floors-below-ground-level/floors-below-ground-level.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-secondary-use-building',
  templateUrl: './secondary-use-building.component.html'
})
export class SecondaryUseBuildingComponent extends PageComponent<string[]> {
  static route: string = 'secondary-uses';
  static title: string = "Secondary uses - Register a high-rise building - GOV.UK";

  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  secondaryUseBuildingHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection!.BuildingUse.SecondaryUseBuilding) { this.applicationService.currentKbiSection!.BuildingUse.SecondaryUseBuilding = []; }
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.BuildingUse.SecondaryUseBuilding);
    this.errorMessage = `Select the secondary uses for ${this.getInfraestructureName()}`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.BuildingUse.SecondaryUseBuilding = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.BuildingUse.PrimaryUseOfBuilding && this.applicationService.currentKbiSection?.BuildingUse.PrimaryUseOfBuilding.length > 0;
  }

  override isValid(): boolean {
    this.secondaryUseBuildingHasErrors = !this.model || this.model?.length == 0;

    if (this.secondaryUseBuildingHasErrors) this.firstCheckboxAnchorId = `assembly_recreation-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;

    return !this.secondaryUseBuildingHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(FloorsBelowGroundLevelComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

}
