import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, FireDoorsCommon } from 'src/app/services/application.service';
import { EnergyTypeComponent } from '../../2-energy/energy-type/energy-type.component';
import { KbiEnergyModule } from '../../2-energy/kbi.energy.module';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

type Error = { hasError: boolean, errorMessage: string }

@Component({
  selector: 'hse-fire-doors-common',
  templateUrl: './fire-doors-common.component.html'
})
export class FireDoorsCommonComponent extends PageComponent<FireDoorsCommon> {
  static route: string = 'doors-common';
  static title: string = "Common parts fire doors - Register a high-rise building - GOV.UK";

  hasError: boolean = false;
  
  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  errorMessages: Record<string, string> = {
    "fireDoorThirtyMinute": "Enter the number of fire doors with 30 minute certified fire resistance, for example '0', or '18'",
    "fireDoorSixtyMinute": "Enter the number of fire doors with 60 minute certified fire resistance, for example '0', or '18'",
    "fireDoorHundredTwentyMinute": "Enter the number of fire doors with 120 minute certified fire resistance, for example '0', or '18'",
    "fireDoorUnknown": "Enter the number of fire doors with not known certified fire resistance, for example '0', or '18'"
  }

  defaultErrorMessage: string = "Number of doors must be a whole number, for example '0' or '18'";
  errors = {
    fireDoorThirtyMinute: { hasError: false, errorMessage: "" } as Error,
    fireDoorSixtyMinute: { hasError: false, errorMessage: "" } as Error,
    fireDoorHundredTwentyMinute: { hasError: false, errorMessage: "" } as Error,
    fireDoorUnknown: { hasError: false, errorMessage: "" } as Error
  };

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection!.Fire.FireDoorsCommon) {
      this.applicationService.currentKbiSection!.Fire.FireDoorsCommon = {};
    }

    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection?.Fire.FireDoorsCommon);
  }
  
  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Fire.FireDoorsCommon = CloneHelper.DeepCopy(this.model);
  }
  
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Fire.ResidentialUnitFrontDoors?.NoFireResistance
      && !!this.applicationService.currentKbiSection?.Fire.ResidentialUnitFrontDoors?.ThirtyMinsFireResistance
      && !!this.applicationService.currentKbiSection?.Fire.ResidentialUnitFrontDoors?.SixtyMinsFireResistance
      && !!this.applicationService.currentKbiSection?.Fire.ResidentialUnitFrontDoors?.HundredTwentyMinsFireResistance
      && !!this.applicationService.currentKbiSection?.Fire.ResidentialUnitFrontDoors?.NoFireResistance
  }
  
  override isValid(): boolean {
    this.errors.fireDoorThirtyMinute = this.validateNumericInput(this.model?.FireDoorThirtyMinute, this.errors.fireDoorThirtyMinute, "fireDoorThirtyMinute");
    this.errors.fireDoorSixtyMinute = this.validateNumericInput(this.model?.FireDoorSixtyMinute, this.errors.fireDoorSixtyMinute, "fireDoorSixtyMinute");
    this.errors.fireDoorHundredTwentyMinute = this.validateNumericInput(this.model?.FireDoorHundredTwentyMinute, this.errors.fireDoorHundredTwentyMinute, "fireDoorHundredTwentyMinute");
    this.errors.fireDoorUnknown = this.validateNumericInput(this.model?.FireDoorUnknown, this.errors.fireDoorUnknown, "fireDoorUnknown");

    return !this.errors.fireDoorThirtyMinute.hasError
      && !this.errors.fireDoorSixtyMinute.hasError
      && !this.errors.fireDoorHundredTwentyMinute.hasError
      && !this.errors.fireDoorUnknown.hasError;
  }
  
  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(`../${KbiEnergyModule.baseRoute}/${EnergyTypeComponent.route}`, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  validateNumericInput(input: number | undefined, error: Error, key: string): Error {
    error.hasError = !input || !FieldValidations.IsWholeNumber(input) || !FieldValidations.IsAPositiveNumber(input);
    if (error.hasError) error.errorMessage = !input ? this.errorMessages[key] : this.defaultErrorMessage;
    return error;
  }
}
