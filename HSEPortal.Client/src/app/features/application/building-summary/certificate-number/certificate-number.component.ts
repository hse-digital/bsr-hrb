import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { SectionAddressComponent } from "../address/address.component";
import { PageComponent } from "src/app/helpers/page.component";

@Component({
  templateUrl: './certificate-number.component.html'
})
export class CertificateNumberComponent extends PageComponent<string> {
  static route: string = 'certificate-number';
  static title: string = 'What is the section completion certificate number? - Register a high-rise building - GOV.UK';
  


  isOptional: boolean = true;
  certificateHasErrors: boolean = false;
  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentSection.CompletionCertificateReference;
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
    applicationService.currentSection.CompletionCertificateReference = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    this.certificateHasErrors = !this.isOptional && !this.model;
    return !this.certificateHasErrors;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(SectionAddressComponent.route,  this.activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

}
