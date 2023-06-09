import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { AddedFloorsTypeComponent } from '../added-floors-type/added-floors-type.component';
import { MostRecentChangeComponent } from '../most-recent-material-change/most-recent-material-change.component';
import { YearMostRecentChangeComponent } from '../year-most-recent-change/year-most-recent-change.component';
import { BuildingInformationCheckAnswersComponent } from '../../check-answers-building-information/check-answers-building-information.component';
import { KbiCheckAnswersModule } from '../../check-answers-building-information/kbi.check-answers-building-information.module';

@Component({
  selector: 'hse-undergone-building-material-changes',
  templateUrl: './undergone-building-material-changes.component.html'
})
export class UndergoneBuildingMaterialChangesComponent  extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'undergone-building-material-changes';
  static title: string = "Building works since original build - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  undergoneBuildingMaterialChangesHasErrors = false;
  concreteLargePanelSystemSelected: boolean = false;


  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges) { this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges = []; }
    this.errorMessage = `Select building works since ${this.getInfraestructureName()} was originally built`;

    if (this.applicationService.currentKbiSection!.BuildingStructure.BuildingStructureType?.some(x => x == 'concrete_large_panels_1960' || x == 'concrete_large_panels_1970')) {
      this.concreteLargePanelSystemSelected = true;
    }
    else {
      if (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges?.some(x => x == 'reinforcement_works_large_panel_system')) {
        this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges = this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges?.filter(x => x != 'reinforcement_works_large_panel_system');
        if (this.equipmentCheckboxGroup?.checkboxElements?.some(x => x.innerId == 'reinforcement_works_large_panel_system')) {
          this.equipmentCheckboxGroup!.checkboxElements.find(x => x.innerId == 'reinforcement_works_large_panel_system')!.checked = false;
        }
      }
    }
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.undergoneBuildingMaterialChangesHasErrors = !this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges || this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges.length == 0;

    if (this.undergoneBuildingMaterialChangesHasErrors) this.firstCheckboxAnchorId = `asbestos_removal-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;


    return this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.length > 0;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {

    if (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.some(x => x == 'none' || x == 'unknown')) {
      return navigationService.navigateRelative(`../check-answers/check-answers-building-information`, activatedRoute);
    }
    else if (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.length > 1 && !this.applicationService.currentKbiSection?.BuildingUse.UndergoneBuildingMaterialChanges?.some(x => x == 'floors_added' || x == 'none' || x == 'unknown')) {
      return navigationService.navigateRelative(MostRecentChangeComponent.route, activatedRoute);

    }
    else if (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.length == 1 && !this.applicationService.currentKbiSection?.BuildingUse.UndergoneBuildingMaterialChanges?.some(x => x == 'floors_added' || x == 'none' || x == 'unknown')) {
      if (this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange
        && !this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.includes(this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange)) {
        this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange = this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges![0];
      }
      return navigationService.navigateRelative(YearMostRecentChangeComponent.route, activatedRoute);
    }
    else if (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.some(x => x == 'floors_added')) {
      this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange = this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges![0];
      return navigationService.navigateRelative(AddedFloorsTypeComponent.route, activatedRoute);
    }
    return navigationService.navigateRelative(UndergoneBuildingMaterialChangesComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
    //return !!this.applicationService.currentKbiSection?.ExternalWallInsulation?.CheckBoxSelection && (this.applicationService.currentKbiSection!.ExternalWallInsulation?.CheckBoxSelection![0] == 'none' || !!(this.applicationService.currentKbiSection!.ExternalWallInsulationPercentages));
    //TODO update can access logic for this page
  }

}
