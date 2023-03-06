import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { OrganisationNamedContactDetailsComponent } from "./named-contact-details.component";

@Component({
  templateUrl: './named-contact.component.html'
})
export class OrganisationNamedContactComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'named-contact';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
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

}