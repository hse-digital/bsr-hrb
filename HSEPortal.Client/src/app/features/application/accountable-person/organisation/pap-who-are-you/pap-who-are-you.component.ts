import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PapNamedRoleComponent } from '../pap-named-role/pap-named-role.component';
import { ActingForSameAddressComponent } from '../acting-for-same-address/acting-for-same-address.component';
import { GovukErrorSummaryComponent } from 'hse-angular';

@Component({
  templateUrl: './pap-who-are-you.component.html'
})
export class PapWhoAreYouComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'who-are-you';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  roleHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  getErrorMessage() {
    return `Select if you are the named contact at ${this.applicationService.currentAccountablePerson.OrganisationName} or registering for them`;
  }

  canContinue(): boolean {
    this.roleHasErrors = !this.applicationService.currentAccountablePerson.Role;
    return !this.roleHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.applicationService.currentAccountablePerson.Role == 'named_contact') {
      return navigationService.navigateRelative(PapNamedRoleComponent.route, activatedRoute);
    }

    return navigationService.navigateRelative(ActingForSameAddressComponent.route, activatedRoute);
  }

}
