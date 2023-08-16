import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { ApplicationService } from 'src/app/services/application.service';
import { OnSiteEnergyGenerationComponent } from '../on-site-energy-generation/on-site-energy-generation.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-energy-type',
  templateUrl: './energy-type.component.html'
})
export class EnergyTypeComponent extends PageComponent<string[]> {
  static route: string = 'type';
  static title: string = "Energy storage - Register a high-rise building - GOV.UK";

  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  energyTypeHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection?.Energy) this.applicationService.currentKbiSection!.Energy = {}
    if (!this.applicationService.currentKbiSection!.Energy.EnergyTypeStorage) { this.applicationService.currentKbiSection!.Energy.EnergyTypeStorage = []; }
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.Energy.EnergyTypeStorage);
    this.errorMessage = `Select the types of energy supply in ${this.getInfraestructureName()}`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Energy.EnergyTypeStorage = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Fire.FireDoorsCommon?.FireDoorThirtyMinute
      && !!this.applicationService.currentKbiSection?.Fire.FireDoorsCommon?.FireDoorSixtyMinute
      && !!this.applicationService.currentKbiSection?.Fire.FireDoorsCommon?.FireDoorHundredTwentyMinute
      && !!this.applicationService.currentKbiSection?.Fire.FireDoorsCommon?.FireDoorUnknown
  }

  override isValid(): boolean {
    this.energyTypeHasErrors = !this.model || this.model?.length == 0;

    if (this.energyTypeHasErrors) this.firstCheckboxAnchorId = `hydrogen_batteries-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;

    return !this.energyTypeHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(OnSiteEnergyGenerationComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }
}
