import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { CertificateNumberComponent } from "../certificate-number/certificate-number.component";
import { PageComponent } from "src/app/helpers/page.component";
import { CompletionCertificateDateComponent } from "../completion-certificate-date/completion-certificate-date.component";

@Component({
  templateUrl: './certificate-issuer.component.html'
})
export class CertificateIssuerComponent extends PageComponent<string> {
  static route: string = 'certificate-issuer';
  static title: string = "Who is the section completion certificate issuer? - Register a high-rise building - GOV.UK";



  isOptional: boolean = true;
  certificateHasErrors: boolean = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
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
    if (this.applicationService.currentSection.YearOfCompletionOption == 'year-exact') {
      var yearOfCompletion = Number(this.applicationService.currentSection.YearOfCompletion);
      if (yearOfCompletion && yearOfCompletion >= 2023) {
        this.isOptional = false;
      }
    } else if (this.applicationService.currentSection.YearOfCompletionOption == 'year-not-exact') {
      if (this.applicationService.currentSection.YearOfCompletionRange == "2023-onwards") {
        this.isOptional = false;
      }
    }
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentSection.CompletionCertificateIssuer = this.model;
  }

  override isValid(): boolean {
    this.certificateHasErrors = !this.isOptional && !this.model;
    return !this.certificateHasErrors;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(CompletionCertificateDateComponent.route, this.activatedRoute);
  }

}
