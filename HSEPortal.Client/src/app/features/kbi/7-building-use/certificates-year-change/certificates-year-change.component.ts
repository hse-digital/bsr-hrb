import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { UndergoneBuildingMaterialChangesComponent } from '../undergone-building-material-changes/undergone-building-material-changes.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-certificates-year-change',
  templateUrl: './certificates-year-change.component.html'
})
export class CertificatesYearChangeComponent extends PageComponent<number> {
  static route: string = 'year-change-use';
  static title: string = "Year of change in use - Register a high-rise building - GOV.UK";

  errorMessage?: string;
  certificatesYearChangesHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection?.BuildingUse.YearChangeInUse);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.BuildingUse.YearChangeInUse = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.BuildingUse.PreviousUseBuilding && this.applicationService.currentKbiSection?.BuildingUse.PreviousUseBuilding.length > 0;
  }

  override isValid(): boolean {
    var currentSection = this.applicationService.model.Sections.filter(x => !x.Scope?.IsOutOfScope)[this.applicationService._currentKbiSectionIndex];

    this.certificatesYearChangesHasErrors = true;
    if (!this.model || this.model.toString().trim().length == 0) {
      return true; // This screen is optional.
    } else if (this.model.toString().trim().length != 4
      || !FieldValidations.IsWholeNumber(this.model)
      || !FieldValidations.IsGreaterThanZero(this.model)) {
      this.errorMessage = `Year ${this.getInfraestructureName()} changed use must be a real year. For example, '1994'`;
    } else if (this.model <= Number(currentSection.YearOfCompletion)) {
      this.errorMessage = `Year ${this.getInfraestructureName()} changed use must be after the building was completed in ${currentSection.YearOfCompletion}`;
    } else {
      this.certificatesYearChangesHasErrors = false;
    }

    return !this.certificatesYearChangesHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(UndergoneBuildingMaterialChangesComponent.route, this.activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }
}
