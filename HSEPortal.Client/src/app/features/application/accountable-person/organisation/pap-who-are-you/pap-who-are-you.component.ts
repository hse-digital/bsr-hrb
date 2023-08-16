import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { PapNamedRoleComponent } from '../pap-named-role/pap-named-role.component';
import { ActingForSameAddressComponent } from '../acting-for-same-address/acting-for-same-address.component';
import { LeadNameComponent } from '../lead-name/lead-name.component';
import { ApHelper } from 'src/app/helpers/ap-helper';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  templateUrl: './pap-who-are-you.component.html'
})
export class PapWhoAreYouComponent extends PageComponent<string> {
  static route: string = 'who-are-you';
  static title: string = "What is your role at PAP organisation? - Register a high-rise building - GOV.UK";



  roleHasErrors = false;
  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = this.applicationService.currentAccountablePerson.Role;
    this.previousAnswer = this.applicationService.currentAccountablePerson.Role;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
      && ApHelper.isOrganisation(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    this.roleHasErrors = !this.model;
    return !this.roleHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentAccountablePerson.Role == 'named_contact') {
      return this.navigationService.navigateRelative(PapNamedRoleComponent.route, this.activatedRoute);
    }

    if (this.applicationService.currentAccountablePerson.Role == 'employee') {
      return this.navigationService.navigateRelative(LeadNameComponent.route, this.activatedRoute);
    }

    return this.navigationService.navigateRelative(ActingForSameAddressComponent.route, this.activatedRoute);
  }

  previousAnswer?: string;
  override async onSave(): Promise<void> {
    this.applicationService.currentAccountablePerson.Role = this.model;
    let newAnswer = this.applicationService.currentAccountablePerson.Role;
    if (this.previousAnswer && this.previousAnswer != newAnswer) {
      this.returnUrl = undefined;

      this.applicationService.currentAccountablePerson.ActingForAddress = undefined;
      this.applicationService.currentAccountablePerson.ActingForSameAddress = undefined;
      this.applicationService.currentAccountablePerson.LeadJobRole = undefined;
      this.applicationService.currentAccountablePerson.LeadEmail = undefined;
      this.applicationService.currentAccountablePerson.LeadFirstName = undefined;
      this.applicationService.currentAccountablePerson.LeadLastName = undefined;
      this.applicationService.currentAccountablePerson.LeadJobRole = undefined;
      this.applicationService.currentAccountablePerson.LeadPhoneNumber = undefined;

      await this.applicationService.updateApplication();
    }
  }

  getErrorMessage() {
    return `Select if you are the named contact at ${this.applicationService.currentAccountablePerson.OrganisationName} or registering for them`;
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }
}
