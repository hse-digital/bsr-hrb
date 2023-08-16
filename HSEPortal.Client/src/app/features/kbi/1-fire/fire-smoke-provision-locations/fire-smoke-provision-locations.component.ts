import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxComponent } from 'hse-angular';
import { ApplicationService } from 'src/app/services/application.service';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { LiftsComponent } from '../lifts/lifts.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-fire-smoke-provision-locations',
  templateUrl: './fire-smoke-provision-locations.component.html'
})
export class FireSmokeProvisionLocationsComponent extends PageComponent<Record<string, string[]>> {
  static route: string = 'smoke-provision-locations';
  static title: string = "Location of fire and smoke controls - Register a high-rise building - GOV.UK";

  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;
  errorMessage?: string;

  firstCheckboxAnchorId?: string;
  locationsHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  currentEquipment?: string;
  provisionsWithLocations?: string[];

  getNextEquipment() {
    let currentIndex = this.provisionsWithLocations?.indexOf(this.currentEquipment!) ?? -1;
    let nextIndex = currentIndex + 1 < this.provisionsWithLocations!.length ? currentIndex + 1 : currentIndex;
    return this.provisionsWithLocations![nextIndex];
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  private equipmentNameMapper: Record<string, string> = {
    "alarm_heat_smoke": "alarm sounders (connected to detectors)",
    "alarm_call_points": "alarm sounders (connected to call points)",
    "fire_dampers": "fire dampers",
    "fire_extinguishers": "fire extinguishers",
    "fire_shutters": "fire shutters",
    "heat_detectors": "heat detectors",
    "risers_dry": "risers dry",
    "risers_wet": "risers wet",
    "smoke_aovs": "automatic smoke control systems",
    "smoke_manual": "manual smoke control systems",
    "smoke_detectors": "smoke detectors",
    "sprinklers_misters": "sprinklers and misters",
  }
  getEquipmentName(equipment: string) {
    return this.equipmentNameMapper[equipment];
  }

  override onInit(applicationService: ApplicationService): void {
    this.provisionsWithLocations = this.getProvisionsWithLocation();

    // init locations
    if (!this.applicationService.currentKbiSection?.Fire.FireSmokeProvisionLocations || Object.keys(this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations).length == 0) {
      this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations = {};
      this.provisionsWithLocations?.forEach(equipment => {
        this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![equipment] = [];
      });
    }
    
    // check missing locations (in case the user modifies fire-smoke-provisions)
    if (Object.keys(this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations).length != this.provisionsWithLocations?.length) {
      this.provisionsWithLocations?.filter(x => !this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![x]).forEach(missingEquipment => {
        this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![missingEquipment] = [];
      });
    }

    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection?.Fire.FireSmokeProvisionLocations);
    
    // getting current equipment
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentEquipment = params['equipment'] ?? this.provisionsWithLocations![0];
      this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection?.Fire.FireSmokeProvisionLocations);
    });

    // if equipment doesn't exist, go to "not found" page
    if (!this.applicationService.currentKbiSection?.Fire.FireSmokeProvisionLocations[this.currentEquipment!]) {
      this.navigationService.navigate(NotFoundComponent.route);
    }

    this.errorMessage = `Select where the ${this.getEquipmentName(this.currentEquipment!)} are in ${this.getInfraestructureName()}`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations = CloneHelper.DeepCopy(this.model);
  }

  override isValid(): boolean {
    this.firstCheckboxAnchorId = `basement-${this.checkboxes?.first.innerId}`;
    this.locationsHasErrors = !this.model![this.currentEquipment!] || this.model![this.currentEquipment!].length == 0;
    if (this.locationsHasErrors) this.errorMessage = `Select where the ${this.getEquipmentName(this.currentEquipment!)} are in ${this.getInfraestructureName()}`;
    return !this.locationsHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    let nextEquipment = this.getNextEquipment();
    if (this.currentEquipment == nextEquipment) {
      return this.navigationService.navigateRelative(LiftsComponent.route, this.activatedRoute);
    }

    return this.navigationService.navigateRelative(FireSmokeProvisionLocationsComponent.route, this.activatedRoute, { equipment: nextEquipment });
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    let provisionsWithLocations = this.getProvisionsWithLocation();
    return !!provisionsWithLocations && provisionsWithLocations!.length > 0;
  }

  private provisionsWithoutLocation = ["risers_dry", "risers_wet", "fire_extinguishers"]
  getProvisionsWithLocation() {
    return this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions?.filter(x => !this.provisionsWithoutLocation.includes(x));
  }

}
