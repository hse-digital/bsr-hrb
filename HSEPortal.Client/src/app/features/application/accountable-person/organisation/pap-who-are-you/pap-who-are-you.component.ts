import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PapNamedRoleComponent } from '../pap-named-role/pap-named-role.component';
import { ActingForSameAddressComponent } from '../acting-for-same-address/acting-for-same-address.component';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { LeadNameComponent } from '../lead-name/lead-name.component';

@Component({
  templateUrl: './pap-who-are-you.component.html'
})
export class PapWhoAreYouComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'who-are-you';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  roleHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  previousAnswer?: string;
  ngOnInit(): void {
    this.previousAnswer = this.applicationService.currentAccountablePerson.Role;
  }

  getErrorMessage() {
    return `Select if you are the named contact at ${this.applicationService.currentAccountablePerson.OrganisationName} or registering for them`;
  }

  canContinue(): boolean {
    this.roleHasErrors = !this.applicationService.currentAccountablePerson.Role;
    return !this.roleHasErrors;
  }

  override async onSave(): Promise<void> {
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

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.applicationService.currentAccountablePerson.Role == 'named_contact') {
      return navigationService.navigateRelative(PapNamedRoleComponent.route, activatedRoute);
    }

    if (this.applicationService.currentAccountablePerson.Role == 'employee') {
      return navigationService.navigateRelative(LeadNameComponent.route, activatedRoute);
    }

    return navigationService.navigateRelative(ActingForSameAddressComponent.route, activatedRoute);
  }

  sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return (!!this.applicationService.currentAccountablePerson.IsPrincipal && this.applicationService.currentAccountablePerson.IsPrincipal == "no")
        || !!this.applicationService.currentAccountablePerson.Type && this.applicationService.currentAccountablePerson.Type == "organisation"
  }
}
