import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';

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
    this.certificatesYearChangesHasErrors = true;
    if (!this.applicationService.currenKbiSection?.YearChangeInUse || this.applicationService.currenKbiSection?.YearChangeInUse.toString().trim().length == 0) {
      return true; // This screen is optional.
    } else if ( this.applicationService.currenKbiSection.YearChangeInUse.toString().trim().length != 4
      || !FieldValidations.IsWholeNumber(this.applicationService.currenKbiSection?.YearChangeInUse)
      || !FieldValidations.IsGreaterThanZero(this.applicationService.currenKbiSection?.YearChangeInUse)) {
      this.errorMessage = `Year ${this.getInfraestructureName()} changed use must be a real year. For example, '1994'`;
    } else if (this.applicationService.currenKbiSection.YearChangeInUse < Number(this.applicationService.currentSection.YearOfCompletion)) {
      this.errorMessage = `Year ${this.getInfraestructureName()} changed use must be after the building was completed in ${this.applicationService.currentSection.YearOfCompletion}`;
    } else {
      this.certificatesYearChangesHasErrors = false;
    }

    return !this.certificatesYearChangesHasErrors;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(CertificatesYearChangeComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection?.PreviousUseBuilding && this.applicationService.currenKbiSection?.PreviousUseBuilding.length > 0;
  }


}
