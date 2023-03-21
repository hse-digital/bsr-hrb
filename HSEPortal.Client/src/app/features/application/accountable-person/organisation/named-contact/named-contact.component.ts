import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { OrganisationNamedContactDetailsComponent } from "./named-contact-details.component";

@Component({
  templateUrl: './named-contact.component.html'
})
export class OrganisationNamedContactComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'named-contact';
  static title: string = "Who is the AP organisation named contact? - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  getOrganisationName() {
    return this.applicationService.currentAccountablePerson.OrganisationName;
  }

  canContinue() {
    this.firstNameInError = !this.applicationService.currentAccountablePerson.NamedContactFirstName;
    this.lastNameInError = !this.applicationService.currentAccountablePerson.NamedContactLastName;

    return !this.firstNameInError && !this.lastNameInError;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(OrganisationNamedContactDetailsComponent.route, activatedRoute);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentAccountablePerson.SectionsAccountability && this.applicationService.currentAccountablePerson.Type == "organisation";
  }

}
