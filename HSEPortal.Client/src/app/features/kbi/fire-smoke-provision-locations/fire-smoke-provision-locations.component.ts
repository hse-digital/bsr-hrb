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
    if (!this.applicationService.currenKbiSection?.FireSmokeProvisionLocations || Object.keys(this.applicationService.currenKbiSection!.FireSmokeProvisionLocations).length == 0) {
      this.applicationService.currenKbiSection!.FireSmokeProvisionLocations = {};
      this.applicationService.currenKbiSection?.FireSmokeProvisions?.forEach(equipment => {
        this.applicationService.currenKbiSection!.FireSmokeProvisionLocations![equipment] = [];
      });
    }

    // check missing locations (in case the user modifies fire-smoke-provisions)
    if (Object.keys(this.applicationService.currenKbiSection!.FireSmokeProvisionLocations).length != this.applicationService.currenKbiSection?.FireSmokeProvisions?.length) {
      this.applicationService.currenKbiSection?.FireSmokeProvisions?.filter(x => !this.applicationService.currenKbiSection!.FireSmokeProvisionLocations![x]).forEach(missingEquipment => {
        this.applicationService.currenKbiSection!.FireSmokeProvisionLocations![missingEquipment] = [];
      });
    }

    // getting current equipment
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentEquipment = params['equipment'] ?? this.applicationService.currenKbiSection?.FireSmokeProvisions![0];
    });

    // if equipment doesn't exist, go to "not found" page
    if (!this.applicationService.currenKbiSection?.FireSmokeProvisionLocations[this.currentEquipment!]) {
      this.navigationService.navigate(NotFoundComponent.route);
    }

    this.errorMessage = `Select where the ${this.getEquipmentName(this.currentEquipment!)} are in ${this.getInfraestructureName()}`;
  }

  getNextEquipment() {
    let currentIndex = this.applicationService.currenKbiSection!.FireSmokeProvisions?.indexOf(this.currentEquipment!) ?? -1;
    let nextIndex = currentIndex + 1 < this.applicationService.currenKbiSection!.FireSmokeProvisions!.length ? currentIndex + 1 : currentIndex;
    return this.applicationService.currenKbiSection!.FireSmokeProvisions![nextIndex];
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
    this.locationsHasErrors = !this.applicationService.currenKbiSection!.FireSmokeProvisionLocations![this.currentEquipment!] || this.applicationService.currenKbiSection!.FireSmokeProvisionLocations![this.currentEquipment!].length == 0;
    if(this.locationsHasErrors) this.errorMessage = `Select where the ${this.getEquipmentName(this.currentEquipment!)} are in ${this.getInfraestructureName()}`;
    return !this.locationsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let nextEquipment = this.getNextEquipment();
    if (this.currentEquipment != nextEquipment) {
      return navigationService.navigateRelative(FireSmokeProvisionLocationsComponent.route, activatedRoute, {
        equipment: nextEquipment
      });
    }
    return navigationService.navigateRelative(LiftsComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection?.FireSmokeProvisions 
        && this.applicationService.currenKbiSection!.FireSmokeProvisions!.length > 0;
  }
}
