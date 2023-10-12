import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { SectionAddressComponent } from "../address/address.component";
import { CertificateIssuerComponent } from "../certificate-issuer/certificate-issuer.component";
import { SectionYearRangeComponent } from "../year-range/year-range.component";
import { PageComponent } from "src/app/helpers/page.component";
import { WhoIssuedCertificateComponent } from "../who-issued-certificate/who-issued-certificate.component";

export type YearOfCompletion = {YearOfCompletionOption?: string, YearOfCompletion?: string}

@Component({
  templateUrl: './year-of-completion.component.html'
})
export class SectionYearOfCompletionComponent extends PageComponent<YearOfCompletion> {
  static route: string = 'year-of-completion';
  static title: string = "When was the section originally built? - Register a high-rise building - GOV.UK";

  yearOfCompletionHasErrors = false;
  exactYearHasErrors = false;
  errorMessage = `Select if you know what year ${this.sectionBuildingName()} was completed`;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = {};
    this.model.YearOfCompletionOption = this.applicationService.currentSection.YearOfCompletionOption;
    this.model.YearOfCompletion = this.applicationService.currentSection.YearOfCompletion;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentSection.YearOfCompletionOption = this.model?.YearOfCompletionOption;
    this.applicationService.currentSection.YearOfCompletion = this.model?.YearOfCompletion;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    let yearOfCompletionOption = this.model?.YearOfCompletionOption;
    let yearOfCompletion = this.model?.YearOfCompletion;

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

  override navigateNext(): Promise<boolean> {
    let route = WhoIssuedCertificateComponent.route;

    if (this.model?.YearOfCompletionOption == 'not-completed') {
      route = SectionAddressComponent.route;
    } else if (this.model?.YearOfCompletionOption == 'year-exact') {
      var yearOfCompletion = Number(this.model?.YearOfCompletion);
      if (yearOfCompletion && yearOfCompletion < 1985) {
        route = SectionAddressComponent.route;
      }
    } else if (this.model?.YearOfCompletionOption == 'year-not-exact') {
      route = SectionYearRangeComponent.route;
    }

    return this.navigationService.navigateRelative(route, this.activatedRoute);
  }

  radioChange() {
    if (this.model?.YearOfCompletionOption != 'year-exact') {
      this.model!.YearOfCompletion = undefined;
    }
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }
}
