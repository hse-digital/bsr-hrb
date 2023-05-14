import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { FireDoorsCommonComponent } from '../fire-doors-common/fire-doors-common.component';

type Error = { hasError: boolean, errorMessage: string, message: string }

@Component({
  selector: 'hse-residential-unit-front-doors-fire-resistance',
  templateUrl: './residential-unit-front-doors-fire-resistance.component.html'
})
export class ResidentialUnitFrontDoorsFireResistanceComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = "residential-unit-front-doors-fire-resistance";
  static title: string = "Residential fire doors - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  errorMessage: string = "Number of doors must be a whole number, for example '0' or '18'";
  errors = {
    noFireResistance: { hasError: false, errorMessage: "", message: "Enter the number of residential front doors with no certified fire resistance, for example '0', or '18'" } as Error,
    thirtyMinsFireResistance: { hasError: false, errorMessage: "", message: "Enter the number of residential front doors with 30 minute certified fire resistance, for example '0', or '18'" } as Error,
    sixtyMinsFireResistance: { hasError: false, errorMessage: "", message: "Enter the number of residential front doors with 60 minute certified fire resistance, for example '0', or '18'" } as Error,
    hundredTwentyMinsFireResistance: { hasError: false, errorMessage: "", message: "Enter the number of residential front doors with 120 minute certified fire resistance, for example '0', or '18'" } as Error,
    notKnownFireResistance: { hasError: false, errorMessage: "", message: "Enter the number of residential front doors with not known certified fire resistance, for example '0', or '18'" } as Error
  };

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.residentialUnitFrontDoors) {
      this.applicationService.currenKbiSection!.residentialUnitFrontDoors = {};
    }
  }

  canContinue() {
    this.errors.noFireResistance = this.validateNumericInput(this.applicationService.currenKbiSection?.residentialUnitFrontDoors?.noFireResistance, this.errors.noFireResistance);
    this.errors.thirtyMinsFireResistance = this.validateNumericInput(this.applicationService.currenKbiSection?.residentialUnitFrontDoors?.thirtyMinsFireResistance, this.errors.thirtyMinsFireResistance);
    this.errors.sixtyMinsFireResistance = this.validateNumericInput(this.applicationService.currenKbiSection?.residentialUnitFrontDoors?.sixtyMinsFireResistance, this.errors.sixtyMinsFireResistance);
    this.errors.hundredTwentyMinsFireResistance = this.validateNumericInput(this.applicationService.currenKbiSection?.residentialUnitFrontDoors?.hundredTwentyMinsFireResistance, this.errors.hundredTwentyMinsFireResistance);
    this.errors.notKnownFireResistance = this.validateNumericInput(this.applicationService.currenKbiSection?.residentialUnitFrontDoors?.notKnownFireResistance, this.errors.notKnownFireResistance);

    return !this.errors.noFireResistance.hasError 
      && !this.errors.thirtyMinsFireResistance.hasError 
      && !this.errors.sixtyMinsFireResistance.hasError 
      && !this.errors.hundredTwentyMinsFireResistance.hasError 
      && !this.errors.notKnownFireResistance.hasError;
  }

  validateNumericInput(input: number | undefined, error: Error): Error {
    error.hasError = !input || !FieldValidations.IsWholeNumber(input) || !FieldValidations.IsAPositiveNumber(input);
    if (error.hasError) error.errorMessage = !input ? error.message : this.errorMessage;
    return error;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  override canAccess(_: ActivatedRouteSnapshot) {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(FireDoorsCommonComponent.route, activatedRoute);
  }

}
