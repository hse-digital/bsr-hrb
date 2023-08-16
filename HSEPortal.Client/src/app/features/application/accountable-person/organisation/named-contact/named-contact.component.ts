import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApHelper } from "src/app/helpers/ap-helper";
import { ApplicationService } from "src/app/services/application.service";
import { OrganisationNamedContactDetailsComponent } from "./named-contact-details.component";
import { PageComponent } from "src/app/helpers/page.component";

export type AccountableNamedPersonContactDetails = {NamedContactFirstName?: string, NamedContactLastName?: string}

@Component({
  templateUrl: './named-contact.component.html'
})
export class OrganisationNamedContactComponent extends PageComponent<AccountableNamedPersonContactDetails> {
  static route: string = 'named-contact';
  static title: string = "Who is the AP organisation named contact? - Register a high-rise building - GOV.UK";



  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  } 

  override onInit(applicationService: ApplicationService): void {
    this.model = {
      NamedContactFirstName: this.applicationService.currentAccountablePerson.NamedContactFirstName,
      NamedContactLastName: this.applicationService.currentAccountablePerson.NamedContactLastName
    }
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentAccountablePerson.NamedContactFirstName = this.model?.NamedContactFirstName;
    this.applicationService.currentAccountablePerson.NamedContactLastName = this.model?.NamedContactLastName;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
      && ApHelper.isOrganisation(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    this.firstNameInError = !this.model?.NamedContactFirstName;
    this.lastNameInError = !this.model?.NamedContactLastName;

    return !this.firstNameInError && !this.lastNameInError;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(OrganisationNamedContactDetailsComponent.route, this.activatedRoute);
  }

  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  getOrganisationName() {
    return this.applicationService.currentAccountablePerson.OrganisationName;
  }

}
