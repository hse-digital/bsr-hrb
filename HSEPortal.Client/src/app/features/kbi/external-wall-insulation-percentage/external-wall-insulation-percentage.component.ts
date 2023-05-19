import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

type Error = {errorMessage: string , errorAnchorId: string}

@Component({
  selector: 'hse-external-wall-insulation-percentage',
  templateUrl: './external-wall-insulation-percentage.component.html'
})
export class ExternalWallInsulationPercentageComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'external-wall-insulation-percentage';
  static title: string = "Percentage insulation materials in outside walls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }


  errorMessages: Record<string, string> = {
    "emptyFieldError": "Estimate the percentage of insulationName in the outside walls of " + this.getInfraestructureName(),
    "invalidPercentageExceedsHundredError": "insulationName must be 100% or less",
    "invalidPercentageLessThanOneError": "insulationName must be 1% or more",
    "totalNotEqual100": "Percentage of all insulation must total 100",
    "invalidCharactersError": "Percentage of insulationName must be a number",
  }

  defaultErrorMessage: string = "Percentage of all insulation must total 100";
  errors: Error[] = [];

  private insulationTypeMapper: Record<string, string> = {
    "fibre_glass_mineral_wool": "fibre Insulation - glass or mineral wool",
    "fibre_wood_sheep_wool": "fibre Insulation - wood or sheep wool",
    "foil_bubble_multifoil_insulation": "foil bubble or multifoil insulation",
    "phenolic_foam": "phenolic foam",
    "eps_xps": "polystyrene insulation - expanded polystyrene (EPS) or extruded polystyrene (XPS)",
    "pur_pir_iso": "polyurethane (PUR) or polyisocyanurate (PIR or ISO)",
    "Other": "Other",
  }
  getInsulationName(equipment: string) {
    return this.insulationTypeMapper[equipment];
  }

  ngOnInit(): void {
      //Initilise the percentage values
      if (!this.applicationService.currenKbiSection?.externalWallInsulationPercentages || Object.keys(this.applicationService.currenKbiSection!.externalWallInsulationPercentages).length == 0) {
        this.applicationService.currenKbiSection!.externalWallInsulationPercentages = {};
        this.applicationService.currenKbiSection?.externalWallInsulation!.checkBoxSelection!.forEach(insulationType => {
          this.applicationService.currenKbiSection!.externalWallInsulationPercentages![insulationType]
        });
    }

    // check missing locations (in case the user modifies fire-smoke-provisions)
    if (Object.keys(this.applicationService.currenKbiSection!.externalWallInsulationPercentages).length != this.applicationService.currenKbiSection?.externalWallInsulation?.checkBoxSelection?.length) {
      this.applicationService.currenKbiSection?.externalWallInsulation?.checkBoxSelection?.filter(x => !this.applicationService.currenKbiSection!.externalWallInsulationPercentages![x]).forEach(missingInsulation => {
        this.applicationService.currenKbiSection!.externalWallInsulationPercentages![missingInsulation];
      });
    }
  }

  canContinue() {
    this.errors=[]

    for (var insulationType in this.applicationService.currenKbiSection!.externalWallInsulationPercentages) {
      //Check is not null or whitespace
      this.validateInputs(this.applicationService.currenKbiSection!.externalWallInsulationPercentages[insulationType], insulationType)
    }
    this.validateTotalPercentage

    this.validateTotalPercentage();
      console.log(this.errors)

    return !!(this.errors.length===0)

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

  validateInputs(input: number | undefined, insulationType: string): void {

    //Validate is not null or whitespace
    if (!input || !FieldValidations.IsNotNullOrWhitespace(input.toString())) {
      this.errors.push({errorMessage: this.errorMessages["emptyFieldError"].replace("insulationName", this.getInsulationName(insulationType)), errorAnchorId: insulationType});
    }
    //Validate is less than or equal to 100
    if (!input || !FieldValidations.IsLessThanOrEqualTo100(input)) {
      this.errors.push({errorMessage: this.errorMessages["invalidPercentageExceedsHundredError"].replace("insulationName", this.getInsulationName(insulationType)), errorAnchorId: insulationType });
    }
    //Validate is greater than or equal to 1
    if (!input || !FieldValidations.IsGreaterThanZero(input)) {
      this.errors.push({errorMessage: this.errorMessages["invalidPercentageLessThanOneError"].replace("insulationName", this.getInsulationName(insulationType)), errorAnchorId: insulationType });
    }
    //Validate is a number
    if (!input || isNaN(input)) {
      this.errors.push({ errorMessage: this.errorMessages["invalidCharactersError"].replace("insulationName", this.getInsulationName(insulationType)), errorAnchorId: insulationType });
    }
  }

  validateTotalPercentage(): void {

    //add up all the percentages from the inputs using reduce function
    let totalPercentage = Object.values(this.applicationService.currenKbiSection!.externalWallInsulationPercentages!).reduce((totalPercentage, percentage) => totalPercentage + +percentage, 0);
    totalPercentage === 100 ? true : this.errors.push({ errorMessage: this.errorMessages["totalNotEqual100"], errorAnchorId: Object.keys(this.applicationService.currenKbiSection!.externalWallInsulationPercentages!)[0] });

  }




}
