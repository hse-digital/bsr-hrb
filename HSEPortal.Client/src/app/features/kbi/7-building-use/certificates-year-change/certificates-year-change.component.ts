import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { UndergoneBuildingMaterialChangesComponent } from '../undergone-building-material-changes/undergone-building-material-changes.component';

@Component({
  selector: 'hse-certificates-year-change',
  templateUrl: './certificates-year-change.component.html'
})
export class CertificatesYearChangeComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'year-change-use';
  static title: string = "Year of change in use - Register a high-rise building - GOV.UK";

  errorMessage?: string;
  certificatesYearChangesHasErrors = false;
  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue(): boolean {
    var currentSection = this.applicationService.model.Sections.filter(x => !x.Scope?.IsOutOfScope)[this.applicationService._currentKbiSectionIndex];

    this.certificatesYearChangesHasErrors = true;
    if (!this.applicationService.currentKbiSection?.BuildingUse.YearChangeInUse || this.applicationService.currentKbiSection?.BuildingUse.YearChangeInUse.toString().trim().length == 0) {
      return true; // This screen is optional.
    } else if (this.applicationService.currentKbiSection.BuildingUse.YearChangeInUse.toString().trim().length != 4
      || !FieldValidations.IsWholeNumber(this.applicationService.currentKbiSection?.BuildingUse.YearChangeInUse)
      || !FieldValidations.IsGreaterThanZero(this.applicationService.currentKbiSection?.BuildingUse.YearChangeInUse)) {
      this.errorMessage = `Year ${this.getInfraestructureName()} changed use must be a real year. For example, '1994'`;
    } else if (this.applicationService.currentKbiSection.BuildingUse.YearChangeInUse <= Number(currentSection.YearOfCompletion)) {
      this.errorMessage = `Year ${this.getInfraestructureName()} changed use must be after the building was completed in ${currentSection.YearOfCompletion}`;
    } else {
      this.certificatesYearChangesHasErrors = false;
    }

    return !this.certificatesYearChangesHasErrors;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(UndergoneBuildingMaterialChangesComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currentKbiSection?.BuildingUse.PreviousUseBuilding && this.applicationService.currentKbiSection?.BuildingUse.PreviousUseBuilding.length > 0;
  }
}
