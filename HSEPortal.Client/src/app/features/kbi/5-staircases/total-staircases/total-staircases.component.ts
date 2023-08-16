import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { ExternalWallMaterialsComponent } from '../../6-walls/external-wall-materials/external-wall-materials.component';
import { KbiWallsModule } from '../../6-walls/kbi.walls.module';
import { PageComponent } from 'src/app/helpers/page.component';

export type Staircases = { TotalNumberStaircases?: number, InternalStaircasesAllFloors?: number };

@Component({
  selector: 'hse-total-staircases',
  templateUrl: './total-staircases.component.html'
})
export class TotalStaircasesComponent extends PageComponent<Staircases> {
  static route: string = 'total';
  static title: string = "Staircases - Register a high-rise building - GOV.UK";

  errors = {
    totalNumberStaircases: { message: "", hasError: false },
    internalStaircasesAllFloors: { message: "", hasError: false },
    internalLowerOrEqualThanTotalNumberStaircases: { message: "Number of staircases serving all floors from ground level must be the same as the total number of staircases or fewer", hasError: false }
  }

  roofTypeHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if(!this.applicationService.currentKbiSection?.Staircases) this.applicationService.currentKbiSection!.Staircases = {}
    this.model = {
      TotalNumberStaircases: this.applicationService.currentKbiSection?.Staircases.TotalNumberStaircases,
      InternalStaircasesAllFloors: this.applicationService.currentKbiSection?.Staircases.InternalStaircasesAllFloors
    }
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Staircases.TotalNumberStaircases = this.model?.TotalNumberStaircases;
    this.applicationService.currentKbiSection!.Staircases.InternalStaircasesAllFloors = this.model?.InternalStaircasesAllFloors;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Roof.RoofMaterial;
  }

  override isValid(): boolean {
    this.validateTotalNumberStaircases();
    this.validateInternalStaircasesAllFloors();
    this.validateInternalIsGreaterThanTotalNumberStaircases();

    this.roofTypeHasErrors = this.errors.totalNumberStaircases.hasError
      || this.errors.internalStaircasesAllFloors.hasError
      || this.errors.internalLowerOrEqualThanTotalNumberStaircases.hasError;

    return !this.roofTypeHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(`../${KbiWallsModule.baseRoute}/${ExternalWallMaterialsComponent.route}`, this.activatedRoute);
  }
  
  validateTotalNumberStaircases() {
    this.errors.totalNumberStaircases.hasError = true;
    if (!this.model?.TotalNumberStaircases) {
      this.errors.totalNumberStaircases.message = "Enter the total number of staircases";
    } else if (!FieldValidations.IsWholeNumber(this.model.TotalNumberStaircases) || !FieldValidations.IsAPositiveNumber(this.model.TotalNumberStaircases) || this.model.TotalNumberStaircases > 99) {
      this.errors.totalNumberStaircases.message = "Total number of staircases must be a whole number and 99 or fewer";
    } else {
      this.errors.totalNumberStaircases.hasError = false;
    }
    return !this.errors.totalNumberStaircases.hasError;
  }

  validateInternalStaircasesAllFloors() {
    this.errors.internalStaircasesAllFloors.hasError = true;
    if (!this.model?.InternalStaircasesAllFloors) {
      this.errors.internalStaircasesAllFloors.message = "Enter the number of staircases serving all floors from ground level";
    } else if (!FieldValidations.IsWholeNumber(this.model.InternalStaircasesAllFloors) || !FieldValidations.IsAPositiveNumber(this.model.InternalStaircasesAllFloors) || this.model.InternalStaircasesAllFloors > 99) {
      this.errors.internalStaircasesAllFloors.message = "Number of staircases serving all floors from ground level must be a whole number and 99 or fewer";
    } else {
      this.errors.internalStaircasesAllFloors.hasError = false;
    }
    return !this.errors.internalStaircasesAllFloors.hasError;
  }

  validateInternalIsGreaterThanTotalNumberStaircases() {
    this.errors.internalLowerOrEqualThanTotalNumberStaircases.hasError = false;
    if (!!this.model?.TotalNumberStaircases && !!this.model.InternalStaircasesAllFloors
      && Number(this.model.TotalNumberStaircases) < Number(this.model.InternalStaircasesAllFloors)) {
      this.errors.internalLowerOrEqualThanTotalNumberStaircases.hasError = true;
    }
    return this.errors.internalLowerOrEqualThanTotalNumberStaircases.hasError;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

}
