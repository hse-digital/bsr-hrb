import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { FireSmokeProvisionLocationsComponent } from '../fire-smoke-provision-locations/fire-smoke-provision-locations.component';
import { LiftsComponent } from '../lifts/lifts.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-fire-smoke-provisions',
  templateUrl: './fire-smoke-provisions.component.html'
})
export class FireSmokeProvisionsComponent extends PageComponent<string[]> {
  static route: string = 'smoke-provisions';
  static title: string = "Common parts fire and smoke controls - Register a high-rise building - GOV.UK";

  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  fireSmokeProvisionsHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions) { this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions = []; }
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions);
    this.errorMessage = `Select the fire and smoke control equipment in the residential common parts of ${this.getInfraestructureName()}`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions = CloneHelper.DeepCopy(this.model);
    this.mapLocations();
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Fire.ProvisionsEquipment
      && this.applicationService.currentKbiSection!.Fire.ProvisionsEquipment.length > 0;
  }

  override isValid(): boolean {
    this.fireSmokeProvisionsHasErrors = !this.model || this.model?.length == 0;

    if (this.fireSmokeProvisionsHasErrors) {
      this.firstCheckboxAnchorId = `alarm_heat_smoke-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    }

    return !this.fireSmokeProvisionsHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    let provisionsWithLocation = this.getProvisionsWithLocation();
    if (!this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions?.includes('none') && !!provisionsWithLocation && provisionsWithLocation.length > 0) {
      return this.navigationService.navigateRelative(FireSmokeProvisionLocationsComponent.route, this.activatedRoute, {
        equipment: provisionsWithLocation![0]
      });
    }

    return this.navigationService.navigateRelative(LiftsComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  mapLocations() {
    let provisionsWithLocations = this.getProvisionsWithLocation();
    // init locations
    if (!this.applicationService.currentKbiSection?.Fire.FireSmokeProvisionLocations || Object.keys(this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations).length == 0) {
      this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations = {};
      provisionsWithLocations?.forEach(equipment => {
        this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![equipment] = [];
      });
    }

    // Mapping locations
    let aux: Record<string, string[]> = {};
    provisionsWithLocations?.forEach(x =>
      aux[x] = (!!this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![x] && this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![x].length > 0)
        ? this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![x]
        : []
    );
    this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations = aux;
  }
  
  private provisionsWithoutLocation = ["risers_dry", "risers_wet", "fire_extinguishers"]
  getProvisionsWithLocation() {
    return this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions?.filter(x => !this.provisionsWithoutLocation.includes(x));
  }
}
