import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { FireSmokeProvisionsComponent } from '../fire-smoke-provisions/fire-smoke-provisions.component';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-provisions-equipment',
  templateUrl: './provisions-equipment.component.html'
})
export class ProvisionsEquipmentComponent extends PageComponent<string[]> {
  static route: string = 'provisions-equipment';
  static title: string = "Residential fire and smoke controls - Register a high-rise building - GOV.UK";

  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  provisionsEquipmentHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection!.Fire.ProvisionsEquipment) { this.applicationService.currentKbiSection!.Fire.ProvisionsEquipment = []; }
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.Fire.ProvisionsEquipment);
    this.errorMessage = `Select the fire and smoke control equipment in the residential units of ${this.getInfraestructureName()}`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Fire.ProvisionsEquipment = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection!.Fire.StrategyEvacuateBuilding;
  }

  override isValid(): boolean {
    this.provisionsEquipmentHasErrors = !this.model || this.model?.length == 0;

    if (this.provisionsEquipmentHasErrors) this.firstCheckboxAnchorId = `heat_detectors-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;

    return !this.provisionsEquipmentHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(FireSmokeProvisionsComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }
}
