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

  ngOnInit(): void {
    // init locations
    if (!this.applicationService.currenKbiSection?.Fire.FireSmokeProvisionLocations || Object.keys(this.applicationService.currenKbiSection!.Fire.FireSmokeProvisionLocations).length == 0) {
      this.applicationService.currenKbiSection!.Fire.FireSmokeProvisionLocations = {};
      this.applicationService.currenKbiSection?.Fire.FireSmokeProvisions?.forEach(equipment => {
        this.applicationService.currenKbiSection!.Fire.FireSmokeProvisionLocations![equipment] = [];
      });
    }

    // check missing locations (in case the user modifies fire-smoke-provisions)
    if (Object.keys(this.applicationService.currenKbiSection!.Fire.FireSmokeProvisionLocations).length != this.applicationService.currenKbiSection?.Fire.FireSmokeProvisions?.length) {
      this.applicationService.currenKbiSection?.Fire.FireSmokeProvisions?.filter(x => !this.applicationService.currenKbiSection!.Fire.FireSmokeProvisionLocations![x]).forEach(missingEquipment => {
        this.applicationService.currenKbiSection!.Fire.FireSmokeProvisionLocations![missingEquipment] = [];
      });
    }

    // getting current equipment
    let nextEquipment = this.applicationService.currenKbiSection?.Fire.FireSmokeProvisions!.find(x => !this.applicationService.currenKbiSection!.Fire.FireSmokeProvisionLocations![x] || this.applicationService.currenKbiSection!.Fire.FireSmokeProvisionLocations![x].length == 0);
    this.currentEquipment = nextEquipment ?? this.applicationService.currenKbiSection?.Fire.FireSmokeProvisions![0];

    // if equipment doesn't exist, go to "not found" page
    if (!this.applicationService.currenKbiSection?.Fire.FireSmokeProvisionLocations[this.currentEquipment!]) {
      this.navigationService.navigate(NotFoundComponent.route);
    }

    this.errorMessage = `Select where the ${this.getEquipmentName(this.currentEquipment!)} are in ${this.getInfraestructureName()}`;
  }

  getNextEquipment() {
    let currentIndex = this.applicationService.currenKbiSection!.Fire.FireSmokeProvisions?.indexOf(this.currentEquipment!) ?? -1;
    let nextIndex = currentIndex + 1 < this.applicationService.currenKbiSection!.Fire.FireSmokeProvisions!.length ? currentIndex + 1 : currentIndex;
    return this.applicationService.currenKbiSection!.Fire.FireSmokeProvisions![nextIndex];
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
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
    this.locationsHasErrors = !this.applicationService.currenKbiSection!.Fire.FireSmokeProvisionLocations![this.currentEquipment!] || this.applicationService.currenKbiSection!.Fire.FireSmokeProvisionLocations![this.currentEquipment!].length == 0;
    if (this.locationsHasErrors) this.errorMessage = `Select where the ${this.getEquipmentName(this.currentEquipment!)} are in ${this.getInfraestructureName()}`;
    return !this.locationsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let nextEquipment = this.getNextEquipment();
    if (this.currentEquipment == nextEquipment) {
      return navigationService.navigateRelative(LiftsComponent.route, activatedRoute);
    }

    this.currentEquipment = nextEquipment;
    return Promise.resolve(true);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection?.Fire.FireSmokeProvisions
      && this.applicationService.currenKbiSection!.Fire.FireSmokeProvisions!.length > 0;
  }
}
