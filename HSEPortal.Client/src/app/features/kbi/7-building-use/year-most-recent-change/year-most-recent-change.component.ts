import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'hse-year-most-recent-change',
  templateUrl: './year-most-recent-change.component.html'
})
export class YearMostRecentChangeComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'year-most-recent-change';
  static title: string = "Year of most recent work done - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  yearMostRecentChangeHasError: boolean = false;
  errorMessage?: string;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }


  ngOnInit(): void {
    if (!this.applicationService.currentKbiSection?.BuildingUse.YearMostRecentMaterialChange) {
      this.applicationService.currentKbiSection!.BuildingUse.YearMostRecentMaterialChange;
    }
  }

  canContinue() {
    this.errorMessage = "";

    //If this.applicationService.currentKbiSection!.YearMostRecentMaterialChange is not null, then we need to validate it
    if (this.applicationService.currentKbiSection!.BuildingUse.YearMostRecentMaterialChange) {
      let currentSection = this.applicationService.currentSection!;
      let currentKbiSection = this.applicationService.currentKbiSection!;
      let materialName = this.getMaterialName(currentKbiSection.BuildingUse.MostRecentMaterialChange!).toLowerCase();
      let mostRecentChange = Number(currentKbiSection.BuildingUse.YearMostRecentMaterialChange);

      if (!mostRecentChange || currentKbiSection.BuildingUse.YearMostRecentMaterialChange?.length != 4) {
        this.errorMessage = `Year of ${materialName} must be a real year.For example, '1994'`;
      } else {
        let yearOfCompletion = currentSection.YearOfCompletionOption == 'year-exact' ? Number(currentSection.YearOfCompletion) : this.getYearFromRange(currentSection.YearOfCompletionRange!);
        if (mostRecentChange <= yearOfCompletion) {
          this.errorMessage = `Year of ${materialName} must be after the building was completed in ${yearOfCompletion}`;
        }
      }
    }

    return !this.errorMessage;
  }


  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(YearMostRecentChangeComponent.route, activatedRoute);
  }

  override canAccess(_: ActivatedRouteSnapshot) {
    let mostRecentChange = this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange;
    let floorsAddedisIncluded = mostRecentChange?.includes("floors_added");

    return mostRecentChange !== void 0 && (!floorsAddedisIncluded || this.applicationService.currentKbiSection!.BuildingUse.AddedFloorsType !== void 0);
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
    "otherinstallation_replacement_removal_gas_supply": "Changes to gas supply to",
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
