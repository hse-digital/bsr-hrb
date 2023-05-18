import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { ExternalWallInsulationTypeComponent } from 'src/app/features/kbi/external-wall-insulation-type/external-wall-insulation-type.component';

type Error = { hasError: boolean, errorMessage: string }
@Component({
  selector: 'hse-external-wall-insulation-percentage',
  templateUrl: './external-wall-insulation-percentage.component.html'
})
export class ExternalWallInsulationPercentageComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'external-wall-insulation-percentage';
  static title: string = "Percentage insulation materials in outside walls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  hasError: boolean = false;

  externalInsulationTypes: string[] = this.applicationService.currenKbiSection!.externalWallInsulation!.checkBoxSelection!;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  errorMessages: Record<string, string> = {
    "emptyFieldError": "Estimate the percentage of insulationName in the outside walls of",
    "invalidPercentageExceedsHundredError": "insulationName must be 100% or less",
    "invalidPercentageLessThanOneError": "insulationName must be 1% or more",
    "totalExceedsHundredError": "Percentage of all insulation must total 100",
    "totalLessThanHundredError": "Percentage of all insulation must total 100",
    "invalidCharactersError": "Percentage of insulationName must be a number",
  }

  defaultErrorMessage: string = "Percentage of all insulation must total 100";
  errors = {
    emptyFieldError: { hasError: false, errorMessage: "" } as Error,
    invalidPercentageExceedsHundredError: { hasError: false, errorMessage: "" } as Error,
    invalidPercentageLessThanOneError: { hasError: false, errorMessage: "" } as Error,
    totalExceedsHundredError: { hasError: false, errorMessage: "" } as Error,
    totalLessThanHundredError: { hasError: false, errorMessage: "" } as Error,
    invalidCharactersError: { hasError: false, errorMessage: "" } as Error
  };

  private insulationTypeMapper: Record<string, string> = {
    "fibre_glass_mineral_wool": "fibre Insulation - glass or mineral wool",
    "fibre_wood_sheep_wool": "fibre Insulation - wood or sheep wool",
    "foil_bubble_multifoil_insulation": "foil bubble or multifoil insulation",
    "phenolic_foam": "phenolic foam",
    "eps_xps": "polystyrene insulation - expanded polystyrene (EPS) or extruded polystyrene (XPS)",
    "pur_pir_iso": "polyurethane (PUR) or polyisocyanurate (PIR or ISO)",
    "other": "other",
  }
  getInsulationName(equipment: string) {
    return this.insulationTypeMapper[equipment];
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection!.externalWallInsulationPercentages) {
      this.applicationService.currenKbiSection!.externalWallInsulationPercentages = {};
    }
  }

  canContinue() {



/*    this.errors.fireDoorThirtyMinute = this.validateNumericInput(this.applicationService.currenKbiSection?.fireDoorsCommon?.fireDoorThirtyMinute, this.errors.fireDoorThirtyMinute, "fireDoorThirtyMinute");
    this.errors.fireDoorSixtyMinute = this.validateNumericInput(this.applicationService.currenKbiSection?.fireDoorsCommon?.fireDoorSixtyMinute, this.errors.fireDoorSixtyMinute, "fireDoorSixtyMinute");
    this.errors.fireDoorHundredTwentyMinute = this.validateNumericInput(this.applicationService.currenKbiSection?.fireDoorsCommon?.fireDoorHundredTwentyMinute, this.errors.fireDoorHundredTwentyMinute, "fireDoorHundredTwentyMinute");
    this.errors.fireDoorUnknown = this.validateNumericInput(this.applicationService.currenKbiSection?.fireDoorsCommon?.fireDoorUnknown, this.errors.fireDoorUnknown, "fireDoorUnknown");

    return !this.errors.fireDoorThirtyMinute.hasError
      && !this.errors.fireDoorSixtyMinute.hasError
      && !this.errors.fireDoorHundredTwentyMinute.hasError
      && !this.errors.fireDoorUnknown.hasError;*/

    return false;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(ExternalWallInsulationPercentageComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {

    return true;

  }

  validateNumericInput(input: number | undefined, error: Error, key: string): Error {
    error.hasError = !input || !FieldValidations.IsWholeNumber(input) || !FieldValidations.IsAPositiveNumber(input);
    if (error.hasError) error.errorMessage = !input ? this.errorMessages[key] : this.defaultErrorMessage;
    return error;
  }



}
