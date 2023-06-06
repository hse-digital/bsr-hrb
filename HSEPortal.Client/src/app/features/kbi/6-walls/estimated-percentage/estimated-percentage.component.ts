import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { ExternalWallMaterialsPipe } from 'src/app/pipes/external-wall-materials.pipe';
import { ExternalWallInsulationTypeComponent } from '../external-wall-insulation-type/external-wall-insulation-type.component';

type Error = { hasError: boolean, message: string, id: string }
type Material = { value: string, id: string }

@Component({
  selector: 'hse-estimated-percentage',
  templateUrl: './estimated-percentage.component.html'
})
export class EstimatedPercentageComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'estimated-percentage';
  static title: string = "Percentage materials on outside walls - Register a high-rise building - GOV.UK";

  errors: Error[] = [];
  externalWallMaterials: Material[] = [];

  estimatedPercentageHasErrors = false;
  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.errors = [];
    if (!this.externalWallMaterials) this.externalWallMaterials = [];

    if (!this.applicationService.currenKbiSection?.Walls.ExternalWallMaterialsPercentage || Object.keys(this.applicationService.currenKbiSection!.Walls.ExternalWallMaterialsPercentage).length == 0) {
      this.initExternalWallMaterialsPercentage();
    } else {
      this.mapExternalWallMaterials();
    }

    this.applicationService.currenKbiSection?.Walls.ExternalWallMaterials?.forEach(x => {
      this.externalWallMaterials.push({ value: x, id: x } as Material);
      this.errors.push({ hasError: false, message: '', id: x } as Error);
    });
  }

  initExternalWallMaterialsPercentage() {
    this.applicationService.currenKbiSection!.Walls.ExternalWallMaterialsPercentage = {};
    this.applicationService.currenKbiSection?.Walls.ExternalWallMaterials?.forEach(material => {
      this.applicationService.currenKbiSection!.Walls.ExternalWallMaterialsPercentage![material] = '';
    });
  }

  mapExternalWallMaterials() {
    let aux: Record<string, string> = {};
    this.applicationService.currenKbiSection?.Walls.ExternalWallMaterials?.forEach(x =>
      aux[x] = !!this.applicationService.currenKbiSection!.Walls.ExternalWallMaterialsPercentage![x]
        ? this.applicationService.currenKbiSection!.Walls.ExternalWallMaterialsPercentage![x]
        : ''
    );
    this.applicationService.currenKbiSection!.Walls.ExternalWallMaterialsPercentage = aux;
  }

  initErrors() {
    this.errors = [];
    this.applicationService.currenKbiSection?.Walls.ExternalWallMaterials?.forEach(x => {
      this.errors.push({ hasError: false, message: '', id: x } as Error);
    });
  }

  canContinue(): boolean {
    this.initErrors();
    this.applicationService.currenKbiSection?.Walls.ExternalWallMaterials?.forEach(x => this.validateInput(x));
    this.validateSumAllPercentageMustBe100();
    this.estimatedPercentageHasErrors = this.errors.map(x => x.hasError).reduce((previous, current) => previous || current);
    return !this.estimatedPercentageHasErrors;
  }

  validateInput(input: string) {
    let error = this.errors.find(x => x.id == input)!;
    let percentage = this.applicationService.currenKbiSection?.Walls.ExternalWallMaterialsPercentage![input];
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
    let percentages = Object.values(this.applicationService.currenKbiSection?.Walls.ExternalWallMaterialsPercentage!);
    let totalPercentage = percentages.map(x => Number(x)).reduce((previous, current) => previous + current);
    if (totalPercentage != 100) this.errors.push({ hasError: true, id: this.errors[0].id, message: "Percentage of all materials must total 100" } as Error);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  getErrorMessage(id: string) {
    return this.errors.find(x => x.id == id)?.message ?? "";
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(ExternalWallInsulationTypeComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    let externalWallMaterials = this.applicationService.currenKbiSection?.Walls.ExternalWallMaterials;
    
    let canAccess = !!externalWallMaterials && externalWallMaterials.length > 0;
    if (canAccess && externalWallMaterials!.indexOf('acm') > -1) canAccess &&= !!this.applicationService.currenKbiSection?.Walls.WallACM;
    if (canAccess && externalWallMaterials!.indexOf('hpl') > -1) canAccess &&= !!this.applicationService.currenKbiSection?.Walls.WallHPL;
    return canAccess;
  }

}
