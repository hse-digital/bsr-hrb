import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { EnergyTypeComponent } from '../../2-energy/energy-type/energy-type.component';
import { KbiEnergyModule } from '../../2-energy/kbi.energy.module';

type Error = { hasError: boolean, errorMessage: string }
@Component({
  selector: 'hse-fire-doors-common',
  templateUrl: './fire-doors-common.component.html'
})
export class FireDoorsCommonComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'doors-common';
  static title: string = "Common parts fire doors - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  hasError: boolean = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
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

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.Fire.FireDoorsCommon) {
      this.applicationService.currenKbiSection!.Fire.FireDoorsCommon = {};
    }
  }

  canContinue() {
    this.errors.fireDoorThirtyMinute = this.validateNumericInput(this.applicationService.currenKbiSection?.Fire.FireDoorsCommon?.FireDoorThirtyMinute, this.errors.fireDoorThirtyMinute, "fireDoorThirtyMinute");
    this.errors.fireDoorSixtyMinute = this.validateNumericInput(this.applicationService.currenKbiSection?.Fire.FireDoorsCommon?.FireDoorSixtyMinute, this.errors.fireDoorSixtyMinute, "fireDoorSixtyMinute");
    this.errors.fireDoorHundredTwentyMinute = this.validateNumericInput(this.applicationService.currenKbiSection?.Fire.FireDoorsCommon?.FireDoorHundredTwentyMinute, this.errors.fireDoorHundredTwentyMinute, "fireDoorHundredTwentyMinute");
    this.errors.fireDoorUnknown = this.validateNumericInput(this.applicationService.currenKbiSection?.Fire.FireDoorsCommon?.FireDoorUnknown, this.errors.fireDoorUnknown, "fireDoorUnknown");

    return !this.errors.fireDoorThirtyMinute.hasError
      && !this.errors.fireDoorSixtyMinute.hasError
      && !this.errors.fireDoorHundredTwentyMinute.hasError
      && !this.errors.fireDoorUnknown.hasError;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(`../${KbiEnergyModule.baseRoute}/${EnergyTypeComponent.route}`, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {

    return !!this.applicationService.currenKbiSection?.Fire.ResidentialUnitFrontDoors?.NoFireResistance
      && !!this.applicationService.currenKbiSection?.Fire.ResidentialUnitFrontDoors?.ThirtyMinsFireResistance
      && !!this.applicationService.currenKbiSection?.Fire.ResidentialUnitFrontDoors?.SixtyMinsFireResistance
      && !!this.applicationService.currenKbiSection?.Fire.ResidentialUnitFrontDoors?.HundredTwentyMinsFireResistance
      && !!this.applicationService.currenKbiSection?.Fire.ResidentialUnitFrontDoors?.NoFireResistance
  }

  validateNumericInput(input: number | undefined, error: Error, key: string): Error {
    error.hasError = !input || !FieldValidations.IsWholeNumber(input) || !FieldValidations.IsAPositiveNumber(input);
    if (error.hasError) error.errorMessage = !input ? this.errorMessages[key] : this.defaultErrorMessage;
    return error;
  }


}
