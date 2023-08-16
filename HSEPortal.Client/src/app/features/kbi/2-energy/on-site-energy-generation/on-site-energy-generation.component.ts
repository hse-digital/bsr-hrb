import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { ApplicationService } from 'src/app/services/application.service';
import { EnergySupplyComponent } from '../energy-supply/energy-supply.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-on-site-energy-generation',
  templateUrl: './on-site-energy-generation.component.html'
})
export class OnSiteEnergyGenerationComponent extends PageComponent<string[]> {
  static route: string = 'onsite-generation';
  static title: string = "On site energy generation - Register a high-rise building - GOV.UK";

  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  onsiteEnergyGenerationHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection!.Energy.OnsiteEnergyGeneration) { this.applicationService.currentKbiSection!.Energy.OnsiteEnergyGeneration = []; }
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.Energy.OnsiteEnergyGeneration);
    this.errorMessage = `Select the types of on-site energy generation in  ${this.getInfraestructureName()}`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Energy.OnsiteEnergyGeneration = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Energy.EnergyTypeStorage
      && this.applicationService.currentKbiSection!.Energy.EnergyTypeStorage!.length > 0;
  }

  override isValid(): boolean {
    this.onsiteEnergyGenerationHasErrors = !this.model || this.model?.length == 0;

    if (this.onsiteEnergyGenerationHasErrors) this.firstCheckboxAnchorId = `air-ground-source-heat-pumps-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;

    return !this.onsiteEnergyGenerationHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(EnergySupplyComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }
}
