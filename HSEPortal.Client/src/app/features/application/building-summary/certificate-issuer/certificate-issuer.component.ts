import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { CertificateNumberComponent } from "../certificate-number/certificate-number.component";
import { PageComponent } from "src/app/helpers/page.component";
import { CompletionCertificateDateComponent } from "../completion-certificate-date/completion-certificate-date.component";
import { FieldValidations } from "src/app/helpers/validators/fieldvalidations";
import { SectionAddressComponent } from "../address/address.component";
import { BuildingSummaryNavigation } from "../building-summary.navigation";
import { ChangeBuildingSummaryHelper } from "src/app/helpers/registration-amendments/change-building-summary-helper";

@Component({
  templateUrl: './certificate-issuer.component.html'
})
export class CertificateIssuerComponent extends PageComponent<string> {
  static route: string = 'certificate-issuer';
  static title: string = "Who is the section completion certificate issuer? - Register a high-rise building - GOV.UK";

  isOptional: boolean = true;
  certificateHasErrors: boolean = false;

  constructor(activatedRoute: ActivatedRoute, private buildingSummaryNavigation: BuildingSummaryNavigation) {
    super(activatedRoute);
    this.isPageChangingBuildingSummary(CertificateIssuerComponent.route);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentSection.CompletionCertificateIssuer;

    this.isInputOptional(
      this.applicationService.currentSection.YearOfCompletionOption,
      this.applicationService.currentSection.YearOfCompletionRange,
      this.applicationService.currentSection.YearOfCompletion,
    );
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentSection.CompletionCertificateIssuer = this.model;
  }

  override onInitChange(applicationService: ApplicationService): void | Promise<void> {
    if (!this.applicationService.currentChangedSection.SectionModel?.CompletionCertificateIssuer) {
      this.model = this.applicationService.currentSection.CompletionCertificateIssuer;
    } else {
      this.model = this.applicationService.currentChangedSection.SectionModel?.CompletionCertificateIssuer;    
    }

    let yearOfCompletionOption = FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentChangedSection.SectionModel?.YearOfCompletionOption) ? this.applicationService.currentChangedSection.SectionModel?.YearOfCompletionOption : this.applicationService.currentSection.YearOfCompletionOption;
    let yearOfCompletionRange = FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentChangedSection.SectionModel?.YearOfCompletionRange) ? this.applicationService.currentChangedSection.SectionModel?.YearOfCompletionRange : this.applicationService.currentSection.YearOfCompletionRange;
    let yearOfCompletion = FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentChangedSection.SectionModel?.YearOfCompletion) ? this.applicationService.currentChangedSection.SectionModel?.YearOfCompletion : this.applicationService.currentSection.YearOfCompletion;
    
    this.isInputOptional(yearOfCompletionOption, yearOfCompletionRange, yearOfCompletion);
  }

  override onChange(applicationService: ApplicationService): void | Promise<void> {
    this.applicationService.currentChangedSection!.SectionModel!.CompletionCertificateIssuer = this.model;
  }

  override nextChangeRoute(): string {
    let section = new ChangeBuildingSummaryHelper(this.applicationService).getSections()[this.applicationService._currentSectionIndex];
    return this.buildingSummaryNavigation.getNextChangeRoute(section); 
  }

  private isInputOptional(yearOfCompletionOption: string, yearOfCompletionRange?: string, yearOfCompletion?: string) {
    if (yearOfCompletionOption == 'year-exact') {
      var year = Number(yearOfCompletion);
      if (year && year >= 2023) {
        this.isOptional = false;
      }
    } else if (yearOfCompletionOption == 'year-not-exact') {
      if (yearOfCompletionRange == "2023-onwards") {
        this.isOptional = false;
      }
    }
  }

  override isValid(): boolean {
    this.certificateHasErrors = !this.isOptional && !this.model;
    return !this.certificateHasErrors;
  }

  override navigateNext(): Promise<boolean> {
    if(this.isOptional && !FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentSection.CompletionCertificateIssuer)) {
      return this.navigationService.navigateRelative(SectionAddressComponent.route, this.activatedRoute);  
    }
    return this.navigationService.navigateRelative(CompletionCertificateDateComponent.route, this.activatedRoute);
  }

}
