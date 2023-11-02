import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { SectionHelper } from "src/app/helpers/section-helper"; 
import { ApplicationService } from "src/app/services/application.service";
import { SectionAddressComponent } from "../address/address.component";
import { PageComponent } from "src/app/helpers/page.component";
import { UploadCompletionCertificateComponent } from "../upload-completion-certificate/upload-completion-certificate.component";
import { FieldValidations } from "src/app/helpers/validators/fieldvalidations";
import { BuildingSummaryNavigation } from "../building-summary.navigation";
import { ChangeBuildingSummaryHelper } from "src/app/helpers/registration-amendments/change-building-summary-helper";

@Component({
  templateUrl: './certificate-number.component.html'
})
export class CertificateNumberComponent extends PageComponent<string> {
  static route: string = 'certificate-number';
  static title: string = 'What is the section completion certificate number? - Register a high-rise building - GOV.UK';
  


  isOptional: boolean = true;
  certificateHasErrors: boolean = false;
  constructor(activatedRoute: ActivatedRoute, private buildingSummaryNavigation: BuildingSummaryNavigation) {
    super(activatedRoute);
    this.isPageChangingBuildingSummary(CertificateNumberComponent.route);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentSection.CompletionCertificateReference;
    this.isPageOptional(this.applicationService.currentSection.CompletionCertificateDate)
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.currentSection.CompletionCertificateReference = this.model;
  }

  override onInitChange(applicationService: ApplicationService): void | Promise<void> {
    if (!this.applicationService.currentChangedSection.SectionModel?.CompletionCertificateReference) this.onInit(this.applicationService);
    else {
      this.model = this.applicationService.currentChangedSection.SectionModel?.CompletionCertificateReference;
      let completionCertificateDate = FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentChangedSection.SectionModel?.CompletionCertificateDate) 
        ?  this.applicationService.currentChangedSection.SectionModel?.CompletionCertificateDate
        : this.applicationService.currentSection.CompletionCertificateDate;
      this.isPageOptional(completionCertificateDate);
    }
  }

  override onChange(applicationService: ApplicationService): void | Promise<void> {
    this.applicationService.currentChangedSection!.SectionModel!.CompletionCertificateReference = this.model;
  }

  override nextChangeRoute(): string {
    let section = new ChangeBuildingSummaryHelper(this.applicationService).getSections()[this.applicationService._currentSectionIndex];
    return this.buildingSummaryNavigation.getNextChangeRoute(section);  
  }

  private isPageOptional(completionCertificateDate?: string) {
    if(FieldValidations.IsNotNullOrWhitespace(completionCertificateDate)) {
      let date =  new Date(Number(completionCertificateDate));
      let FirstOctober2023 = new Date(2023, 9, 1); // Month is October, but index is 9 -> "The month as a number between 0 and 11 (January to December)."
      this.isOptional = date < FirstOctober2023;
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    this.certificateHasErrors = !this.isOptional && !this.model;
    return !this.certificateHasErrors;
  }

  override navigateNext(): Promise<boolean> {
    if(this.applicationService.currentSection.WhoIssuedCertificate != "bsr") {
      return this.navigationService.navigateRelative(UploadCompletionCertificateComponent.route,  this.activatedRoute);  
    }
    return this.navigationService.navigateRelative(SectionAddressComponent.route,  this.activatedRoute);
  }

  get errorMessage() {
    return `Enter the completion certificate number for ${this.buildingOrSectionName}`;
  }

}
