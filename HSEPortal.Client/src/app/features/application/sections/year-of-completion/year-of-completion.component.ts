import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { CertificateIssuerComponent } from "../certificate-issuer/certificate-issuer.component";

@Component({
  templateUrl: './year-of-completion.component.html'
})
export class SectionYearOfCompletionComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'year-of-completion';
  static title: string = "When was the section originally built? - Register a high-rise building - GOV.UK";

  yearOfCompletionHasErrors = false;
  exactYearHasErrors = false;
  errorMessage = `Select when ${this.sectionBuildingName()} was originally built`;

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  canContinue(): boolean {
    let yearOfCompletionOption = this.applicationService.currentSection.YearOfCompletionOption;
    let yearOfCompletion = this.applicationService.currentSection.YearOfCompletion;

    this.exactYearHasErrors = false;
    this.yearOfCompletionHasErrors = false;

    if (!yearOfCompletionOption) {
      this.yearOfCompletionHasErrors = true;
    } else if (yearOfCompletionOption == 'year-exact') {
      if (!yearOfCompletion) {
        this.errorMessage = 'Exact year cannot be blank';
        this.exactYearHasErrors = true;
        this.yearOfCompletionHasErrors = true;
      } else if (Number(yearOfCompletion) > new Date().getFullYear()) {
        this.errorMessage = 'Exact year must be this year or in the past';
        this.exactYearHasErrors = true;
        this.yearOfCompletionHasErrors = true;
      } else if (yearOfCompletion.length != 4) {
        this.errorMessage = 'Exact year must be a real year';
        this.exactYearHasErrors = true;
        this.yearOfCompletionHasErrors = true;
      } else if (!Number(yearOfCompletion)) {
        this.errorMessage = 'Exact year must be a number';
        this.exactYearHasErrors = true;
        this.yearOfCompletionHasErrors = true;
      }
    }

    return !this.yearOfCompletionHasErrors && !this.exactYearHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let route = CertificateIssuerComponent.route;
    if (this.applicationService.currentSection.YearOfCompletionOption == 'year-not-exact') {
      route = 'year-range';
    }

    return navigationService.navigateRelative(route, activatedRoute);
  }

  radioChange() {
    if (this.applicationService.currentSection.YearOfCompletionOption != 'year-exact') {
      this.applicationService.currentSection.YearOfCompletion = undefined;
    }
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }
}
