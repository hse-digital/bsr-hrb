import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { ExternalFeaturesComponent } from '../external-features/external-features.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

type Error = { errorMessage: string, errorAnchorId: string, optionId?: string }

@Component({
  selector: 'hse-external-wall-insulation-percentage',
  templateUrl: './external-wall-insulation-percentage.component.html'
})
export class ExternalWallInsulationPercentageComponent extends PageComponent<Record<string, number>> {
  static route: string = 'external-insulation-percentage';
  static title: string = "Percentage insulation materials in outside walls - Register a high-rise building - GOV.UK";

  errors: Error[] = [];
  firstErrorAnchorId?: string;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    //Initilise the percentage values
    if (!this.applicationService.currentKbiSection?.Walls.ExternalWallInsulationPercentages || Object.keys(this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages).length == 0) {
      this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages = {};
      this.applicationService.currentKbiSection?.Walls.ExternalWallInsulation!.CheckBoxSelection!.forEach(insulationType => {
        this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages![insulationType]
      });
    }

    // check missing locations (in case the user modifies fire-smoke-provisions)
    if (Object.keys(this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages).length != this.applicationService.currentKbiSection?.Walls.ExternalWallInsulation?.CheckBoxSelection?.length) {
      this.applicationService.currentKbiSection?.Walls.ExternalWallInsulation?.CheckBoxSelection?.filter(x => !this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages![x]).forEach(missingInsulation => {
        this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages![missingInsulation];
      });
    }

    //If value doesnt exist in this this.applicationService.currentKbiSection?.externalWallInsulation?.checkBoxSelection remove from locations (in case the user modifies external-wall-insulation-type)
    if (Object.keys(this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages).length != this.applicationService.currentKbiSection?.Walls.ExternalWallInsulation?.CheckBoxSelection?.length) {
      Object.keys(this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages).forEach(insulationType => {
        if (!this.applicationService.currentKbiSection?.Walls.ExternalWallInsulation?.CheckBoxSelection?.includes(insulationType)) {
          delete this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages![insulationType];
        }
      });
    }

    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Walls.ExternalWallInsulation?.CheckBoxSelection
      && this.applicationService.currentKbiSection!.Walls.ExternalWallInsulation?.CheckBoxSelection![0] != 'none';
  }

  override isValid(): boolean {
    this.errors = []

    for (var insulationType in this.model) {
      //Check is not null or whitespace
      this.validateInputs(this.model[insulationType], insulationType)
    }

    this.validateTotalPercentage();

    return !!(this.errors.length === 0)
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(ExternalFeaturesComponent.route, this.activatedRoute);
  }

  getErrorForOption(optionId: string): string {
    //Get all errors for this option
    var errors = this.errors.filter(x => x.optionId === optionId);

    //If there are errors, return all as singlestring with breaks between each string
    if (errors.length > 0) {
      return errors.map(x => x.errorMessage).join("\n");
    }
    else {
      return "Estimate the percentage of " + this.getInsulationName(optionId) + " in the outside walls";
    }
  }

  errorMessages: Record<string, string> = {
    "emptyFieldError": "Estimate the percentage of insulationName in the outside walls of " + this.getInfraestructureName(),
    "invalidPercentageExceedsHundredError": "insulationName must be 100% or less",
    "invalidPercentageLessThanOneError": "insulationName must be 1% or more",
    "totalNotEqualHundred": "Percentage of all insulation must total 100",
    "invalidCharactersError": "Percentage of insulationName must be a number",
  }

  private insulationTypeMapper: Record<string, string> = {
    "fibre_glass_mineral_wool": "Fibre insulation - glass or mineral wool",
    "fibre_wood_sheep_wool": "Fibre insulation - wood or sheep wool",
    "foil_bubble_multifoil_insulation": "Foil bubble or multifoil insulation",
    "phenolic_foam": "Phenolic foam",
    "eps_xps": "Polystyrene insulation - expanded polystyrene (EPS) or extruded polystyrene (XPS)",
    "pur_pir_iso": "Polyurethane (PUR) or polyisocyanurate (PIR or ISO)",
    "other": "Other",
  }

  getInsulationName(equipment: string) {
    return this.insulationTypeMapper[equipment];
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  validateInputs(input: number | undefined, insulationType: string): void {
    if (!input || !FieldValidations.IsNotNullOrWhitespace(input.toString())) {
      this.errors.push({ errorMessage: this.errorMessages["emptyFieldError"].replace("insulationName", this.getInsulationName(insulationType)), errorAnchorId: insulationType, optionId: insulationType });
    }

    else if (!input || isNaN(input)) {
      this.errors.push({ errorMessage: this.errorMessages["invalidCharactersError"].replace("insulationName", this.getInsulationName(insulationType)), errorAnchorId: insulationType, optionId: insulationType });
    }

    else if (!input || !FieldValidations.IsLessThanOrEqualTo100(input)) {
      this.errors.push({ errorMessage: this.errorMessages["invalidPercentageExceedsHundredError"].replace("insulationName", this.getInsulationName(insulationType)), errorAnchorId: insulationType, optionId: insulationType });
    }

    else if (!input || !FieldValidations.IsGreaterThanZero(input)) {
      this.errors.push({ errorMessage: this.errorMessages["invalidPercentageLessThanOneError"].replace("insulationName", this.getInsulationName(insulationType)), errorAnchorId: insulationType, optionId: insulationType });
    }

    if (this.errors.length > 0) {
      this.firstErrorAnchorId = this.applicationService.currentKbiSection!.Walls.ExternalWallInsulation?.CheckBoxSelection![0];
    }
  }

  validateTotalPercentage(): void {
    let totalPercentage = Object.values(this.model!).reduce((totalPercentage, percentage) => totalPercentage + +percentage, 0);
    totalPercentage === 100 ? true : this.errors.push({ errorMessage: this.errorMessages["totalNotEqualHundred"], errorAnchorId: Object.keys(this.model!)[0] });
  }
}
