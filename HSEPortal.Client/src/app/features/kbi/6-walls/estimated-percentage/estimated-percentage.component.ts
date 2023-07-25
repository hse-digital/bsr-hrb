import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, KeyValue, KeyValueHelper } from 'src/app/services/application.service';
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

  model?: number[]; 

  estimatedPercentageHasErrors = false;
  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  keyValueHelper?: KeyValueHelper<string, number>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.errors = [];
    if (!this.externalWallMaterials) this.externalWallMaterials = [];
    
    this.model = [];

    this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials?.forEach(x => {
      this.externalWallMaterials.push({ value: x.key, id: x.key } as Material);
      this.errors.push({ hasError: false, message: '', id: x.key } as Error);
      this.model?.push(x.value ?? 0);
    });
  }

  initErrors() {
    this.errors = [];
    this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials?.forEach(x => {
      this.errors.push({ hasError: false, message: '', id: x.key } as Error);
    });
  }

  canContinue(): boolean {
    this.initErrors();
    this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials?.forEach(x => this.validateInput(x.key));
    this.validateSumAllPercentageMustBe100();
    this.estimatedPercentageHasErrors = this.errors.map(x => x.hasError).reduce((previous, current) => previous || current);
    return !this.estimatedPercentageHasErrors;
  }

  validateInput(input: string) {
    let error = this.errors.find(x => x.id == input)!;
    let percentage = this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials?.find(x => x.key == input);
    let label = ExternalWallMaterialsPipe.externalWallMaterials[input];

    error.hasError = true;
    if (!percentage) {
      error.message = `Estimate the percentage of ${label} on the outside walls of ${this.getInfraestructureName()}`;
    } else if (!Number(percentage)) {
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
    let percentages = this.applicationService.currentKbiSection?.Walls.ExternalWallInsulation!.map(x => x.value!)!;
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

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(ExternalWallInsulationTypeComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    let externalWallMaterials = this.applicationService.currentKbiSection?.Walls.ExternalWallMaterials;
    
    let canAccess = !!externalWallMaterials && externalWallMaterials.length > 0;
    if (canAccess && externalWallMaterials!.some(x => x.key.indexOf('acm')> -1)) canAccess &&= !!this.applicationService.currentKbiSection?.Walls.WallACM;
    if (canAccess && externalWallMaterials!.some(x => x.key.indexOf('hpl')> -1)) canAccess &&= !!this.applicationService.currentKbiSection?.Walls.WallHPL;
    return canAccess;
  }

}
