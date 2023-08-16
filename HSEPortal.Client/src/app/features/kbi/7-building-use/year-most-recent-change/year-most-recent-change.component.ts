import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'hse-year-most-recent-change',
  templateUrl: './year-most-recent-change.component.html'
})
export class YearMostRecentChangeComponent extends PageComponent<string> {
  static route: string = 'year-most-recent-change';
  static title: string = "Year of most recent work done - Register a high-rise building - GOV.UK";

  yearMostRecentChangeHasError: boolean = false;
  errorMessage?: string;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection?.BuildingUse.YearMostRecentMaterialChange) {
      this.applicationService.currentKbiSection!.BuildingUse.YearMostRecentMaterialChange;
    }
    this.model = this.applicationService.currentKbiSection!.BuildingUse.YearMostRecentMaterialChange;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.BuildingUse.YearMostRecentMaterialChange = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    let onlyOneMaterialChange = (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.length == 1);
    let mostRecentChangeIsKnown = !this.applicationService.currentKbiSection?.BuildingUse.MostRecentMaterialChange?.includes("unknown");
    let isNoneOrUnknown = this.applicationService.currentKbiSection?.BuildingUse.UndergoneBuildingMaterialChanges?.some(x => x == 'none' || x == 'unknown')
    
    return !isNoneOrUnknown && (onlyOneMaterialChange || mostRecentChangeIsKnown);
  }

  override isValid(): boolean {
    this.errorMessage = "";

    //If this.applicationService.currentKbiSection!.YearMostRecentMaterialChange is not null, then we need to validate it
    if (this.model) {
      let currentSection = this.applicationService.currentSection!;
  
      let materialName = this.getSelectedMaterialName().toLowerCase();
      
      let mostRecentChange = Number(this.model);

      if (!mostRecentChange || this.model?.length != 4) {
        this.errorMessage = `Year of ${materialName} must be a real year. For example, '1994'`;
      } else {
        let yearOfCompletion = currentSection.YearOfCompletionOption == 'year-exact' ? Number(currentSection.YearOfCompletion) : this.getYearFromRange(currentSection.YearOfCompletionRange!);
        if (mostRecentChange <= yearOfCompletion) {
          this.errorMessage = `Year of ${materialName} must be after the building was completed in ${yearOfCompletion}`;
        }
      }
    }

    return !this.errorMessage;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(`../check-answers/check-answers-building-information`, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  getSelectedMaterialName() {
    let selectedMaterial = this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges?.length == 1
      ? this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges[0]
      : this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange;
    return this.getMaterialName(selectedMaterial ?? "unknown");
  }

  private materialNameMapper: Record<string, string> = {
    "asbestos_removal": "Asbestos removal and remediation in",
    "balconies_added": "Balconies added to",
    "changes_residential_units": "Change to number of residential units in",
    "changes_staircase_cores": "Changes to staircases in",
    "changes_windows": "Changes to windows in",
    "complete_rewiring": "Complete rewiring of",
    "floors_added": "Change to number of floors",
    "floors_removed": "Change to number of floors",
    "installation_replacement_removal_fire_systems": "Changes to fire systems in",
    "installation_replacement_removal_lighting": "Changes to lighting in",
    "installation_replacement_removal_cold_water_systems": "Changes to cold water systems in",
    "installation_replacement_removal_gas_supply": "Changes to gas supply to",
    "reinforcement_works_large_panel_system": "Reinforcement of large panel system structure of",
    "work_external_walls": "Work connected to external walls of",
    "unknown": "Not Known",
  }
  getMaterialName(material: string) {
    return this.materialNameMapper[material];
  }

  private yearRangeMapper: Record<string, number> = {
    "before-1900": 1000,
    "1901-to-1955": 1901,
    "1956-to-1969": 1956,
    "1970-to-1984": 1970,
    "1985-to-2000": 1985,
    "2001-to-2006": 2001,
    "2007-to-2018": 2007,
    "2019-to-2022": 2019,
    "2023-onwards": 2023,
  }
  getYearFromRange(range: string) {
    return this.yearRangeMapper[range];
  }
}
