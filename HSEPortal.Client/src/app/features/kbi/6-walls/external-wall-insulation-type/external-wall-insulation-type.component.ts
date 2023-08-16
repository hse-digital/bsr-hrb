import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { ExternalFeaturesComponent } from '../external-features/external-features.component';
import { ExternalWallInsulationPercentageComponent } from '../external-wall-insulation-percentage/external-wall-insulation-percentage.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { PageComponent } from 'src/app/helpers/page.component';

export type ExternalWallInsulation = {
  CheckBoxSelection?: string[],
  OtherValue?: string,
};

@Component({
  selector: 'hse-external-wall-insulation-type',
  templateUrl: './external-wall-insulation-type.component.html'
})
export class ExternalWallInsulationTypeComponent extends PageComponent<ExternalWallInsulation> {
  static route: string = 'external-insulation-type';
  static title: string = "Insulation in outside walls - Register a high-rise building - GOV.UK";

  @ViewChild(GovukCheckboxNoneComponent) checkboxGroup?: GovukCheckboxNoneComponent;

  errorAnchorId?: string;
  errorMessage?: string;
  externalWallInsulationTypeHasErrors: boolean = false;
  otherError: boolean = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (this.applicationService.currentKbiSection!.Walls.ExternalWallInsulation?.CheckBoxSelection === void 0) {
      this.applicationService.currentKbiSection!.Walls.ExternalWallInsulation = { CheckBoxSelection: [], OtherValue: '' };
    }
    this.model = {
      CheckBoxSelection: this.applicationService.currentKbiSection!.Walls.ExternalWallInsulation.CheckBoxSelection,
      OtherValue: this.applicationService.currentKbiSection!.Walls.ExternalWallInsulation.OtherValue
    }
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Walls.ExternalWallInsulation!.CheckBoxSelection = this.model?.CheckBoxSelection;
    this.applicationService.currentKbiSection!.Walls.ExternalWallInsulation!.OtherValue = this.model?.OtherValue;
    this.mapPercentages();
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Walls.ExternalWallMaterialsPercentage
      && Object.keys(this.applicationService.currentKbiSection?.Walls.ExternalWallMaterialsPercentage).length > 0
      && Object.keys(this.applicationService.currentKbiSection?.Walls.ExternalWallMaterialsPercentage).every(x => !!this.applicationService.currentKbiSection?.Walls.ExternalWallMaterialsPercentage![x] && this.applicationService.currentKbiSection?.Walls.ExternalWallMaterialsPercentage[x].length > 0);
  }

  override isValid(): boolean {
    this.externalWallInsulationTypeHasErrors = false;
    this.validateCheckboxSelection();
    this.validateOtherOptionText();

    return !this.externalWallInsulationTypeHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentKbiSection!.Walls.ExternalWallInsulation!.CheckBoxSelection!.includes('none')) {
      return this.navigationService.navigateRelative(ExternalFeaturesComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(ExternalWallInsulationPercentageComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  mapPercentages() {
    if (!this.applicationService.currentKbiSection?.Walls.ExternalWallInsulationPercentages || Object.keys(this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages).length == 0) {
      this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages = {};
      this.applicationService.currentKbiSection?.Walls.ExternalWallInsulation!.CheckBoxSelection!.forEach(insulationType => {
        this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages![insulationType]
      });
    } else {
      let aux: Record<string, number> = {};
      this.applicationService.currentKbiSection?.Walls.ExternalWallInsulation!.CheckBoxSelection!?.forEach(x =>{
        if (!!this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages![x]) {
          aux[x] = this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages![x];
        } else {
          aux[x];
        }
      });
      this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages = aux;
    }
  }

  validateCheckboxSelection() {
    if (this.model?.CheckBoxSelection!.length == 0) {
      this.errorMessage = `Select what type of insulation is used in the outside walls of ${this.getInfraestructureName()}, or select \'None\'`;
      this.errorAnchorId = `fibre_glass_mineral_wool-${this.checkboxGroup?.checkboxElements?.first.innerId}`;
      this.externalWallInsulationTypeHasErrors = true;
    }
  }

  validateOtherOptionText() {
    if (this.model?.CheckBoxSelection!.includes('other')
      && !FieldValidations.IsNotNullOrWhitespace(this.model!.OtherValue)) {
      this.errorMessage = "Enter the other insulation material used";
      this.errorAnchorId = "input-other";
      this.externalWallInsulationTypeHasErrors = this.otherError = true;
    }
  }
}
