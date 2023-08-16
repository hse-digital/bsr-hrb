import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { PrimaryUseBuildingBelowGroundLevelComponent } from '../primary-use-building-below-ground-level/primary-use-building-below-ground-level.component';
import { ChangePrimaryUseComponent } from '../change-primary-use/change-primary-use.component';
import { UndergoneBuildingMaterialChangesComponent } from '../undergone-building-material-changes/undergone-building-material-changes.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-floors-below-ground-level',
  templateUrl: './floors-below-ground-level.component.html'
})
export class FloorsBelowGroundLevelComponent extends PageComponent<number> {
  static route: string = 'floors-below-ground-level';
  static title: string = "Floors below ground level - Register a high-rise building - GOV.UK";

  private RESIDENTIAL_DWELLINGS: string = "residential_dwellings";

  errorMessage?: string;
  floorsBelowGroundLevelHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentKbiSection!.BuildingUse.FloorsBelowGroundLevel;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.BuildingUse.FloorsBelowGroundLevel = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.BuildingUse.SecondaryUseBuilding && this.applicationService.currentKbiSection!.BuildingUse.SecondaryUseBuilding.length > 0;
  }

  override isValid(): boolean {
    let input = this.model;
    this.floorsBelowGroundLevelHasErrors = true;
    if (!input || !FieldValidations.IsWholeNumber(input) || !FieldValidations.IsAPositiveNumber(input)) {
      this.errorMessage = `Number of floors below ground level in ${this.getInfraestructureName()} must be a whole number fewer than 20`;
    } else if ( input > 20) {
      this.errorMessage = `Number of floors below ground level in ${this.getInfraestructureName()} must be a whole number fewer than 20`;
    }

    else {
      this.floorsBelowGroundLevelHasErrors = false;
    }
    return !this.floorsBelowGroundLevelHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    let input = this.applicationService.currentKbiSection?.BuildingUse.FloorsBelowGroundLevel;
    if (input == 0) {
      let route = this.applicationService.currentKbiSection?.BuildingUse.PrimaryUseOfBuilding == this.RESIDENTIAL_DWELLINGS
        ? ChangePrimaryUseComponent.route
        : UndergoneBuildingMaterialChangesComponent.route; // route to "any material changes"
      return this.navigationService.navigateRelative(route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(PrimaryUseBuildingBelowGroundLevelComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

}
