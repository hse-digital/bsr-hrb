import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukCheckboxComponent, GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { LiftsComponent } from '../lifts/lifts.component';

@Component({
  selector: 'hse-fire-smoke-provision-locations',
  templateUrl: './fire-smoke-provision-locations.component.html'
})
export class FireSmokeProvisionLocationsComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'smoke-provision-locations';
  static title: string = "Location of fire and smoke controls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;
  errorMessage?: string;

  firstCheckboxAnchorId?: string;
  locationsHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  currentEquipment?: string;

  private readonly provisionsWithLocation: string[] = ["alarm_heat_smoke", "alarm_call_points", "fire_dampers", "fire_shutters", "heat_detectors", "smoke_aovs", "smoke_manual", "smoke_detectors", "sprinklers_misters"];

  private filteredProvisions: string[] = [];

  ngOnInit(): void {
    this.filteredProvisions = this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions!.filter(x => this.provisionsWithLocation.indexOf(x) > -1);

    // init locations
    if (!this.applicationService.currentKbiSection?.Fire.FireSmokeProvisionLocations || Object.keys(this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations).length == 0) {
      this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations = {};
      this.filteredProvisions.forEach(equipment => {
        this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![equipment] = [];
      });
    }

    // check missing locations (in case the user modifies fire-smoke-provisions)
    if (Object.keys(this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations).length != this.applicationService.currentKbiSection?.Fire.FireSmokeProvisions?.length) {
      this.applicationService.currentKbiSection?.Fire.FireSmokeProvisions?.filter(x => this.provisionsWithLocation.indexOf(x) > -1 && !this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![x]).forEach(missingEquipment => {
        this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![missingEquipment] = [];
      });
    }

    // getting current equipment
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentEquipment = params['equipment'] ?? this.filteredProvisions[0];
    });

    // if equipment doesn't exist, go to "not found" page
    if (!this.applicationService.currentKbiSection?.Fire.FireSmokeProvisionLocations[this.currentEquipment!]) {
      this.navigationService.navigate(NotFoundComponent.route);
    }

    this.errorMessage = `Select where the ${this.getEquipmentName(this.currentEquipment!)} are in ${this.getInfraestructureName()}`;
  }

  getNextEquipment() {
    let currentIndex = this.filteredProvisions.indexOf(this.currentEquipment!) ?? -1;
    let nextIndex = currentIndex + 1 < this.filteredProvisions.length ? currentIndex + 1 : currentIndex;
    return this.filteredProvisions[nextIndex];
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

  canContinue(): boolean {
    this.firstCheckboxAnchorId = `basement-${this.checkboxes?.first.innerId}`;
    this.locationsHasErrors = !this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![this.currentEquipment!] || this.applicationService.currentKbiSection!.Fire.FireSmokeProvisionLocations![this.currentEquipment!].length == 0;
    if (this.locationsHasErrors) this.errorMessage = `Select where the ${this.getEquipmentName(this.currentEquipment!)} are in ${this.getInfraestructureName()}`;
    return !this.locationsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let nextEquipment = this.getNextEquipment();
    if (this.currentEquipment == nextEquipment) {
      return navigationService.navigateRelative(LiftsComponent.route, activatedRoute);
    }

    return navigationService.navigateRelative(FireSmokeProvisionLocationsComponent.route, activatedRoute, { equipment: nextEquipment });
  }

  override canAccess(_: ActivatedRouteSnapshot) {
    return !!this.applicationService.currentKbiSection?.Fire.FireSmokeProvisions && this.applicationService.currentKbiSection!.Fire.FireSmokeProvisions!.length > 0;
  }
}
