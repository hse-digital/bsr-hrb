import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, ResidentialUnitFrontDoors } from 'src/app/services/application.service';
import { FireDoorsCommonComponent } from '../fire-doors-common/fire-doors-common.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

type Error = { hasError: boolean, errorMessage: string }

@Component({
  selector: 'hse-residential-unit-front-doors-fire-resistance',
  templateUrl: './residential-unit-front-doors-fire-resistance.component.html'
})
export class ResidentialUnitFrontDoorsFireResistanceComponent extends PageComponent<ResidentialUnitFrontDoors> {
  static route: string = "residential-unit-front-doors-fire-resistance";
  static title: string = "Residential fire doors - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  errorMessages: Record<string, string> = {
    "noFireResistance": "Enter the number of residential front doors with no certified fire resistance, for example '0', or '18'",
    "thirtyMinsFireResistance": "Enter the number of residential front doors with 30 minute certified fire resistance, for example '0', or '18'",
    "sixtyMinsFireResistance": "Enter the number of residential front doors with 60 minute certified fire resistance, for example '0', or '18'",
    "hundredTwentyMinsFireResistance": "Enter the number of residential front doors with 120 minute certified fire resistance, for example '0', or '18'",
    "notKnownFireResistance": "Enter the number of residential front doors with not known certified fire resistance, for example '0', or '18'"
  }

  defaultErrorMessage: string = "Number of doors must be a whole number, for example '0' or '18'";
  errors = {
    noFireResistance: { hasError: false, errorMessage: "", } as Error,
    thirtyMinsFireResistance: { hasError: false, errorMessage: "", } as Error,
    sixtyMinsFireResistance: { hasError: false, errorMessage: "", } as Error,
    hundredTwentyMinsFireResistance: { hasError: false, errorMessage: "", } as Error,
    notKnownFireResistance: { hasError: false, errorMessage: "",  } as Error
  };

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection!.Fire.ResidentialUnitFrontDoors) {
      this.applicationService.currentKbiSection!.Fire.ResidentialUnitFrontDoors = {};
    }
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.Fire.ResidentialUnitFrontDoors);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Fire.ResidentialUnitFrontDoors = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Fire.Lifts && this.applicationService.currentKbiSection!.Fire.Lifts!.length > 0
  }

  override isValid(): boolean {
    this.errors.noFireResistance = this.validateNumericInput(this.model?.NoFireResistance, this.errors.noFireResistance, "noFireResistance");
    this.errors.thirtyMinsFireResistance = this.validateNumericInput(this.model?.ThirtyMinsFireResistance, this.errors.thirtyMinsFireResistance, "thirtyMinsFireResistance");
    this.errors.sixtyMinsFireResistance = this.validateNumericInput(this.model?.SixtyMinsFireResistance, this.errors.sixtyMinsFireResistance, "sixtyMinsFireResistance");
    this.errors.hundredTwentyMinsFireResistance = this.validateNumericInput(this.model?.HundredTwentyMinsFireResistance, this.errors.hundredTwentyMinsFireResistance, "hundredTwentyMinsFireResistance");
    this.errors.notKnownFireResistance = this.validateNumericInput(this.model?.NotKnownFireResistance, this.errors.notKnownFireResistance, "notKnownFireResistance");

    return !this.errors.noFireResistance.hasError
      && !this.errors.thirtyMinsFireResistance.hasError
      && !this.errors.sixtyMinsFireResistance.hasError
      && !this.errors.hundredTwentyMinsFireResistance.hasError
      && !this.errors.notKnownFireResistance.hasError;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(FireDoorsCommonComponent.route, this.activatedRoute);
  }

  validateNumericInput(input: number | undefined, error: Error, key: string): Error {
    error.hasError = !input || !FieldValidations.IsWholeNumber(input) || !FieldValidations.IsAPositiveNumber(input);
    if (error.hasError) error.errorMessage = !input ? this.errorMessages[key] : this.defaultErrorMessage;
    return error;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

}
