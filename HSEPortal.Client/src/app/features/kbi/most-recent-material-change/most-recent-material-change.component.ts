import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { YearMostRecentChangeComponent } from '../year-most-recent-change/year-most-recent-change.component';

@Component({
  selector: 'hse-most-recent-material-change',
  templateUrl: './most-recent-material-change.component.html'
})
export class MostRecentChangeComponent  extends BaseComponent implements IHasNextPage {
  static route: string = 'most-recent-material-change';
  static title: string = "Most recent work done - Register a high-rise building - GOV.UK";

  errorMessage?: string;
  mostRecentChangeHasErrors = false;
  firstRadioAnchorId?: string;


  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }
  
  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }





  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.MostRecentMaterialChange) { this.applicationService.currenKbiSection!.MostRecentMaterialChange = ""; }

    //If MostRecentMaterialChange is set to an option not available UndergoneBuildingMaterialChanges set MostRecentMaterialChange to empty
    if (this.applicationService.currenKbiSection!.MostRecentMaterialChange
      && !this.applicationService.currenKbiSection!.UndergoneBuildingMaterialChanges!.includes(this.applicationService.currenKbiSection!.MostRecentMaterialChange)) {
      this.applicationService.currenKbiSection!.MostRecentMaterialChange = "";
    }

    this.errorMessage = `Select building works since on ${this.getInfraestructureName()} was originally built`;
  }

  canContinue(): boolean {
    this.mostRecentChangeHasErrors = !this.applicationService.currenKbiSection!.MostRecentMaterialChange;

    if (this.mostRecentChangeHasErrors) this.firstRadioAnchorId = `${this.applicationService.currenKbiSection!.UndergoneBuildingMaterialChanges![0]}-input`;


    console.log(this.errorMessage);

    return !this.mostRecentChangeHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(YearMostRecentChangeComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection!.UndergoneBuildingMaterialChanges
      && (this.applicationService.currenKbiSection!.UndergoneBuildingMaterialChanges.length > 1)

      
      ;
    return true;
  }

  private materialNameMapper: Record<string, string> = {
    "asbestos_removal": "Asbestos removal and remediation on multiple floors",
    "balconies_added": "Balconies added to",
    "changes_residential_units": "Changes in number of residential units",
    "changes_staircase_cores": "Changes in number or location of staircase cores",
    "changes_windows": "Changes to windows",
    "complete_rewiring": "Complete rewiring of buildings or floors",
    "floors_added": "Floors added",
    "floors_removed": "Floors removed",
    "installation_replacement_removal_fire_systems": "Installation, replacement or removal of active or passive fire systems",
    "installation_replacement_removal_cold_water_systems": "Installation, replacement or removal of cold water systems in multiple residential units",
    "installation_replacement_removal_lighting": "Installation, replacement or removal of emergency or other lighting",
    "otherinstallation_replacement_removal_gas_supply": "Installation, replacement or removal of gas supply to building",
    "reinforcement_works_large_panel_system": "Reinforcement works to large panel system structure",
    "work_external_walls": "Work connected to external walls including the removal of cladding",
    "unknown": "Not Known",
  }
  getMaterialName(material: string) {
    return this.materialNameMapper[material];
  }

}
