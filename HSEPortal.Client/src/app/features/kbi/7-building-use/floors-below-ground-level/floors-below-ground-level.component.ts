import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { PrimaryUseBuildingBelowGroundLevelComponent } from '../primary-use-building-below-ground-level/primary-use-building-below-ground-level.component';
import { ChangePrimaryUseComponent } from '../change-primary-use/change-primary-use.component';
import { MostRecentChangeComponent } from '../most-recent-material-change/most-recent-material-change.component';
import { UndergoneBuildingMaterialChangesComponent } from '../undergone-building-material-changes/undergone-building-material-changes.component';

@Component({
  selector: 'hse-floors-below-ground-level',
  templateUrl: './floors-below-ground-level.component.html'
})
export class FloorsBelowGroundLevelComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'floors-below-ground-level';
  static title: string = "Floors below ground level - Register a high-rise building - GOV.UK";

  private RESIDENTIAL_DWELLINGS: string = "residential_dwellings";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  errorMessage?: string;
  floorsBelowGroundLevelHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue() {
    let input = this.applicationService.currentKbiSection!.BuildingUse.FloorsBelowGroundLevel;
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

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let input = this.applicationService.currentKbiSection?.BuildingUse.FloorsBelowGroundLevel;
    if (input == 0) {
      let route = this.applicationService.currentKbiSection?.BuildingUse.PrimaryUseOfBuilding == this.RESIDENTIAL_DWELLINGS
        ? ChangePrimaryUseComponent.route
        : UndergoneBuildingMaterialChangesComponent.route; // route to "any material changes"
      return navigationService.navigateRelative(route, activatedRoute);
    }
    return navigationService.navigateRelative(PrimaryUseBuildingBelowGroundLevelComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currentKbiSection?.BuildingUse.SecondaryUseBuilding && this.applicationService.currentKbiSection!.BuildingUse.SecondaryUseBuilding.length > 0;
  }
}
