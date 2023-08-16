import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { ExternalWallMaterialsPipe } from 'src/app/pipes/external-wall-materials.pipe';
import { ExternalWallInsulationTypeComponent } from '../external-wall-insulation-type/external-wall-insulation-type.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

type Error = { hasError: boolean, message: string, id: string }
type Material = { value: string, id: string }

@Component({
  selector: 'hse-estimated-percentage',
  templateUrl: './estimated-percentage.component.html'
})
export class EstimatedPercentageComponent extends PageComponent<Record<string, string>> {
  static route: string = 'estimated-percentage';
  static title: string = "Percentage materials on outside walls - Register a high-rise building - GOV.UK";

  errors: Error[] = [];
  externalWallMaterials: Material[] = [];

  estimatedPercentageHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.errors = [];
    if (!this.externalWallMaterials) this.externalWallMaterials = [];

    if (!this.applicationService.currentKbiSection?.Walls.ExternalWallMaterialsPercentage || Object.keys(this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage).length == 0) {
      this.initExternalWallMaterialsPercentage();
    } else {
      this.mapExternalWallMaterials();
    }

    this.model = CloneHelper.DeepCopy(applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage);

    this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials?.forEach(x => {
      this.externalWallMaterials.push({ value: x, id: x } as Material);
      this.errors.push({ hasError: false, message: '', id: x } as Error);
    });
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    let externalWallMaterials = this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials;
    
    let canAccess = !!externalWallMaterials && externalWallMaterials.length > 0;
    if (canAccess && externalWallMaterials!.indexOf('acm') > -1) canAccess &&= !!this.applicationService.currentKbiSection?.Walls.WallACM;
    if (canAccess && externalWallMaterials!.indexOf('hpl') > -1) canAccess &&= !!this.applicationService.currentKbiSection?.Walls.WallHPL;
    return canAccess;
  }

  override isValid(): boolean {
    this.initErrors();
    this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials?.forEach(x => this.validateInput(x));
    this.validateSumAllPercentageMustBe100();
    this.estimatedPercentageHasErrors = this.errors.map(x => x.hasError).reduce((previous, current) => previous || current);
    return !this.estimatedPercentageHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(ExternalWallInsulationTypeComponent.route, this.activatedRoute);
  }

  initExternalWallMaterialsPercentage() {
    this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage = {};
    this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials?.forEach(material => {
      this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage![material] = '';
    });
  }

  mapExternalWallMaterials() {
    let aux: Record<string, string> = {};
    this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials?.forEach(x =>
      aux[x] = !!this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage![x]
        ? this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage![x]
        : ''
    );
    this.applicationService.currentKbiSection!.Walls.ExternalWallMaterialsPercentage = aux;
  }

  initErrors() {
    this.errors = [];
    this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials?.forEach(x => {
      this.errors.push({ hasError: false, message: '', id: x } as Error);
    });
  }

  validateInput(input: string) {
    let error = this.errors.find(x => x.id == input)!;
    let percentage = this.model![input];
    let label = ExternalWallMaterialsPipe.externalWallMaterials[input];

    error.hasError = true;
    if (!percentage || percentage.trim().length == 0) {
      error.message = `Estimate the percentage of ${label} on the outside walls of ${this.getInfraestructureName()}`;
    } else if (!Number(percentage) && percentage != "0") {
      error.message = `Percentage of ${label} must be a number`;
    } else if (!FieldValidations.IsGreaterThanZero(Number(percentage))) {
      error.message = `${label} must be 1% or more`;
    } else if (Number(percentage) >= 100) {
      error.message = `${label} must by 100% or less`;
    } else {
      error.hasError = false;
    }
    this.errors.find(x => x.id == input)!.hasError = error.hasError;
    this.errors.find(x => x.id == input)!.message = error.message;
  }

  validateSumAllPercentageMustBe100() {
    let percentages = Object.values(this.model!);
    let totalPercentage = percentages.map(x => Number(x)).reduce((previous, current) => previous + current);
    if (totalPercentage != 100) this.errors.push({ hasError: true, id: this.errors[0].id, message: "Percentage of all materials must total 100" } as Error);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  getErrorMessage(id: string) {
    return this.errors.find(x => x.id == id)?.message ?? "";
  }
}
