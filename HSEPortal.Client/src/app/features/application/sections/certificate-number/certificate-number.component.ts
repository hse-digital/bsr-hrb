import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { SectionHelper } from "src/app/helpers/section-helper";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from "src/app/services/title.service";
import { SectionAddressComponent } from "../address/address.component";

@Component({
  templateUrl: './certificate-number.component.html'
})
export class CertificateNumberComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'certificate-number';
  static title: string = 'What is the section completion certificate number? - Register a high-rise building - GOV.UK';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  
  isOptional: boolean = true;
  certificateHasErrors: boolean = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
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

  canContinue(): boolean {
    this.certificateHasErrors = !this.isOptional && !this.applicationService.currentSection.CompletionCertificateReference;
    return !this.certificateHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(SectionAddressComponent.route, activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return SectionHelper.isSectionAvailable(routeSnapshot, this.applicationService);
  }
}
