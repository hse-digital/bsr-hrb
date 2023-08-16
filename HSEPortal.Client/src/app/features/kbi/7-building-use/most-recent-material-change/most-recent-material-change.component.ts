import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { YearMostRecentChangeComponent } from '../year-most-recent-change/year-most-recent-change.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-most-recent-material-change',
  templateUrl: './most-recent-material-change.component.html'
})
export class MostRecentChangeComponent extends PageComponent<string> {
  static route: string = 'most-recent-material-change';
  static title: string = "Most recent work done - Register a high-rise building - GOV.UK";

  errorMessage?: string;
  mostRecentChangeHasErrors = false;
  firstRadioAnchorId?: string;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange) {
      this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange = "";
    }

    //If MostRecentMaterialChange is set to an option not available UndergoneBuildingMaterialChanges set MostRecentMaterialChange to empty
    if (this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange != "unknown"
      && !this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.includes(this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange)) {
      this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange = "";
    }

    this.model = applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange;

    this.errorMessage = `Select the most recent change made to ${this.getInfraestructureName()}.`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges
      && (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges.length > 1);
  }

  override isValid(): boolean {
    this.mostRecentChangeHasErrors = !this.model;

    if (this.mostRecentChangeHasErrors) this.firstRadioAnchorId = `${this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges![0]}-input`;

    return !this.mostRecentChangeHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange === "unknown") {
      return this.navigationService.navigateRelative(`../check-answers/check-answers-building-information`, this.activatedRoute);
    }
    else {
      return this.navigationService.navigateRelative(YearMostRecentChangeComponent.route, this.activatedRoute);
    }
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  private materialNameMapper: Record<string, string> = {
    "asbestos_removal": "Asbestos removal and remediation on multiple floors",
    "balconies_added": "Balconies added",
    "changes_residential_units": "Changes in number of residential units",
    "changes_staircase_cores": "Changes in number or location of staircase cores",
    "changes_windows": "Changes to windows",
    "complete_rewiring": "Complete rewiring of buildings or floors",
    "floors_added": "Floors added",
    "floors_removed": "Floors removed",
    "installation_replacement_removal_fire_systems": "Installation, replacement or removal of active or passive fire systems",
    "installation_replacement_removal_cold_water_systems": "Installation, replacement or removal of cold water systems in multiple residential units",
    "installation_replacement_removal_lighting": "Installation, replacement or removal of emergency or other lighting",
    "installation_replacement_removal_gas_supply": "Installation, replacement or removal of gas supply to building",
    "reinforcement_works_large_panel_system": "Reinforcement works to large panel system structure",
    "work_external_walls": "Work connected to external walls including the removal of cladding",
    "unknown": "Not Known",
  }
  getMaterialName(material: string) {
    return this.materialNameMapper[material];
  }

}
