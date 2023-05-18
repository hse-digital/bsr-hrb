import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'hse-total-staircases',
  templateUrl: './total-staircases.component.html'
})
export class TotalStaircasesComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'staircases';
  static title: string = "Staircases - Register a high-rise building - GOV.UK";

  errors = {
    totalNumberStaircases: { message: "", hasError: false },
    internalStaircasesAllFloors: { message: "", hasError: false },
    internalLowerOrEqualThanTotalNumberStaircases: { message: "Number of staircases serving all floors from ground level must be the same as the total number of staircases or fewer", hasError: false }
  }

  roofTypeHasErrors = false;
  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue(): boolean {
    this.validateTotalNumberStaircases();
    this.validateInternalStaircasesAllFloors();
    this.validateInternalIsGreaterThanTotalNumberStaircases();

    this.roofTypeHasErrors = this.errors.totalNumberStaircases.hasError
      || this.errors.internalStaircasesAllFloors.hasError
      || this.errors.internalLowerOrEqualThanTotalNumberStaircases.hasError;

    return !this.roofTypeHasErrors;
  }

  validateTotalNumberStaircases() {
    this.errors.totalNumberStaircases.hasError = true;
    if (!this.applicationService.currenKbiSection!.TotalNumberStaircases) {
      this.errors.totalNumberStaircases.message = "Enter the total number of staircases";
    } else if (!FieldValidations.IsWholeNumber(this.applicationService.currenKbiSection!.TotalNumberStaircases) || !FieldValidations.IsAPositiveNumber(this.applicationService.currenKbiSection!.TotalNumberStaircases) || this.applicationService.currenKbiSection!.TotalNumberStaircases > 99) {
      this.errors.totalNumberStaircases.message = "Total number of staircases must be a whole number and 99 or fewer";
    } else {
      this.errors.totalNumberStaircases.hasError = false;
    }
    return !this.errors.totalNumberStaircases.hasError;
  }

  validateInternalStaircasesAllFloors() {
    this.errors.internalStaircasesAllFloors.hasError = true;
    if (!this.applicationService.currenKbiSection!.InternalStaircasesAllFloors) {
      this.errors.internalStaircasesAllFloors.message = "Enter the number of staircases serving all floors from ground level";
    } else if (!FieldValidations.IsWholeNumber(this.applicationService.currenKbiSection!.InternalStaircasesAllFloors) || !FieldValidations.IsAPositiveNumber(this.applicationService.currenKbiSection!.InternalStaircasesAllFloors) || this.applicationService.currenKbiSection!.InternalStaircasesAllFloors > 99) {
      this.errors.internalStaircasesAllFloors.message = "Number of staircases serving all floors from ground level must be a whole number and 99 or fewer";
    } else {
      this.errors.internalStaircasesAllFloors.hasError = false;
    }
    return !this.errors.internalStaircasesAllFloors.hasError;
  }

  validateInternalIsGreaterThanTotalNumberStaircases() {
    this.errors.internalLowerOrEqualThanTotalNumberStaircases.hasError = false;
    if (!!this.applicationService.currenKbiSection!.TotalNumberStaircases && !!this.applicationService.currenKbiSection!.InternalStaircasesAllFloors
      && Number(this.applicationService.currenKbiSection!.TotalNumberStaircases) < Number(this.applicationService.currenKbiSection!.InternalStaircasesAllFloors)) {
      this.errors.internalLowerOrEqualThanTotalNumberStaircases.hasError = true;
    }
    return this.errors.internalLowerOrEqualThanTotalNumberStaircases.hasError;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(TotalStaircasesComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection?.RoofMaterial;
  }

}
