import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukCheckboxComponent, GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';

@Component({
  selector: 'hse-fire-smoke-provision-locations',
  templateUrl: './fire-smoke-provision-locations.component.html'
})
export class FireSmokeProvisionLocationsComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'fire-smoke-provision-locations';
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
    if (!this.applicationService.currenKbiSection?.fireSmokeProvisionLocations || Object.keys(this.applicationService.currenKbiSection!.fireSmokeProvisionLocations).length == 0) {
      this.applicationService.currenKbiSection!.fireSmokeProvisionLocations = {};
      this.applicationService.currenKbiSection?.fireSmokeProvisions?.forEach(equipment => {
        this.applicationService.currenKbiSection!.fireSmokeProvisionLocations![equipment] = [];
      });
    }

    // check missing locations (in case the user modifies fire-smoke-provisions)
    if (Object.keys(this.applicationService.currenKbiSection!.fireSmokeProvisionLocations).length != this.applicationService.currenKbiSection?.fireSmokeProvisions?.length) {
      this.applicationService.currenKbiSection?.fireSmokeProvisions?.filter(x => !this.applicationService.currenKbiSection!.fireSmokeProvisionLocations![x]).forEach(missingEquipment => {
        this.applicationService.currenKbiSection!.fireSmokeProvisionLocations![missingEquipment] = [];
      });
    }

    // getting current equipment
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentEquipment = params['equipment'] ?? this.applicationService.currenKbiSection?.fireSmokeProvisions![0];
    });

    // if equipment doesn't exist, go to "not found" page
    if (!this.applicationService.currenKbiSection?.fireSmokeProvisionLocations[this.currentEquipment!]) {
      this.navigationService.navigate(NotFoundComponent.route);
    }

    this.errorMessage = `Select where the ${this.getEquipmentName(this.currentEquipment!)} are in ${this.getInfraestructureName()}`;
  }

  getNextEquipment() {
    let currentIndex = this.applicationService.currenKbiSection!.fireSmokeProvisions?.indexOf(this.currentEquipment!) ?? -1;
    let nextIndex = currentIndex + 1 < this.applicationService.currenKbiSection!.fireSmokeProvisions!.length ? currentIndex + 1 : currentIndex;
    return this.applicationService.currenKbiSection!.fireSmokeProvisions![nextIndex];
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
    "fire_extinguishers": "fire dampers",
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
    this.locationsHasErrors = !this.applicationService.currenKbiSection!.fireSmokeProvisionLocations![this.currentEquipment!] || this.applicationService.currenKbiSection!.fireSmokeProvisionLocations![this.currentEquipment!].length == 0;
    return !this.locationsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let nextEquipment = this.getNextEquipment();
    if (this.currentEquipment != nextEquipment) {
      return navigationService.navigateRelative(FireSmokeProvisionLocationsComponent.route, activatedRoute, {
        equipment: nextEquipment
      });
    }
    return navigationService.navigateRelative(FireSmokeProvisionLocationsComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
  }
}
