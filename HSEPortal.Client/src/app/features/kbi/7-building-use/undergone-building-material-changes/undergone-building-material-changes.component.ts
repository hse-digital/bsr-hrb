import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { ApplicationService } from 'src/app/services/application.service';
import { AddedFloorsTypeComponent } from '../added-floors-type/added-floors-type.component';
import { MostRecentChangeComponent } from '../most-recent-material-change/most-recent-material-change.component';
import { YearMostRecentChangeComponent } from '../year-most-recent-change/year-most-recent-change.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-undergone-building-material-changes',
  templateUrl: './undergone-building-material-changes.component.html'
})
export class UndergoneBuildingMaterialChangesComponent extends PageComponent<string[]> {
  static route: string = 'undergone-building-material-changes';
  static title: string = "Building works since original build - Register a high-rise building - GOV.UK";

  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  undergoneBuildingMaterialChangesHasErrors = false;
  concreteLargePanelSystemSelected: boolean = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
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
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    let notResidentialDwellings = this.applicationService.currentKbiSection?.BuildingUse.PrimaryUseOfBuilding !== "residential_dwellings";
    let noDifferentPrimaryUse = this.applicationService.currentKbiSection?.BuildingUse.ChangePrimaryUse === 'no';
    let differentPrimaryUsePast = this.applicationService.currentKbiSection?.BuildingUse.ChangePrimaryUse === 'yes' && FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentKbiSection?.BuildingUse.PreviousUseBuilding);

    return notResidentialDwellings || noDifferentPrimaryUse || differentPrimaryUsePast;
  }

  override isValid(): boolean {
    this.undergoneBuildingMaterialChangesHasErrors = !this.model || this.model?.length == 0;

    if (this.undergoneBuildingMaterialChangesHasErrors) {this.firstCheckboxAnchorId = `asbestos_removal-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;}
    else if (this.model!.length > 1 
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentKbiSection?.BuildingUse.MostRecentMaterialChange) 
      && this.applicationService.currentKbiSection?.BuildingUse.MostRecentMaterialChange != "unknown"
      && !this.model!.includes(this.applicationService.currentKbiSection?.BuildingUse.MostRecentMaterialChange!)) {
      
      this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange = "";
    
    }

    return this.model!.length > 0;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.some(x => x == 'none' || x == 'unknown')) {
      return this.navigationService.navigateRelative(`../check-answers/check-answers-building-information`, this.activatedRoute);
    }
    else if (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.length > 1 && !this.applicationService.currentKbiSection?.BuildingUse.UndergoneBuildingMaterialChanges?.some(x => x == 'floors_added' || x == 'none' || x == 'unknown')) {
      return this.navigationService.navigateRelative(MostRecentChangeComponent.route, this.activatedRoute);
    }
    else if (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.length == 1 && !this.applicationService.currentKbiSection?.BuildingUse.UndergoneBuildingMaterialChanges?.some(x => x == 'floors_added' || x == 'none' || x == 'unknown')) {
      return this.navigationService.navigateRelative(YearMostRecentChangeComponent.route, this.activatedRoute);
    }
    else if (this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges!.some(x => x == 'floors_added')) {
      this.applicationService.currentKbiSection!.BuildingUse.MostRecentMaterialChange = this.applicationService.currentKbiSection!.BuildingUse.UndergoneBuildingMaterialChanges![0];
      return this.navigationService.navigateRelative(AddedFloorsTypeComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(UndergoneBuildingMaterialChangesComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }
}
