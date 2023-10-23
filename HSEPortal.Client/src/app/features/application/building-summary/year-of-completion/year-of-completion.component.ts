import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { SectionAddressComponent } from "../address/address.component";
import { CertificateIssuerComponent } from "../certificate-issuer/certificate-issuer.component";
import { SectionYearRangeComponent } from "../year-range/year-range.component";
import { PageComponent } from "src/app/helpers/page.component";
import { WhoIssuedCertificateComponent } from "../who-issued-certificate/who-issued-certificate.component";
import { FieldValidations } from "src/app/helpers/validators/fieldvalidations";
import { BuildingSummaryNavigation } from "../building-summary.navigation";
import { ChangeBuildingSummaryHelper } from "src/app/helpers/registration-amendments/change-building-summary-helper";

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

  constructor(activatedRoute: ActivatedRoute, private buildingSummaryNavigation: BuildingSummaryNavigation) {
    super(activatedRoute);
    this.isPageChangingBuildingSummary(SectionYearOfCompletionComponent.route);
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

  override onInitChange(applicationService: ApplicationService): void | Promise<void> {
    this.model = {};
    this.model.YearOfCompletionOption = this.applicationService.currentChangedSection.SectionModel?.YearOfCompletionOption;
    this.model.YearOfCompletion = this.applicationService.currentChangedSection.SectionModel?.YearOfCompletion;

    if (!FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentChangedSection.SectionModel?.YearOfCompletionOption)) {
      this.model.YearOfCompletionOption = this.applicationService.currentSection.YearOfCompletionOption;
    }
    
    if (!FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentChangedSection.SectionModel?.YearOfCompletion)) {
      this.model.YearOfCompletion = this.applicationService.currentSection.YearOfCompletion;
    }
  }

  override onChange(applicationService: ApplicationService): void | Promise<void> {    
    this.applicationService.currentChangedSection.SectionModel!.YearOfCompletionOption = this.model?.YearOfCompletionOption;
    this.applicationService.currentChangedSection.SectionModel!.YearOfCompletion = this.model?.YearOfCompletion;
  }

  override nextChangeRoute(): string {
    let section = new ChangeBuildingSummaryHelper(this.applicationService).getSections()[this.applicationService._currentSectionIndex];
    return this.buildingSummaryNavigation.getNextChangeRoute(section); 
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
      if (yearOfCompletion && yearOfCompletion < 2023) {
        route = CertificateIssuerComponent.route;
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
