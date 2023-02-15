import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { AccountablePersonModel, ApplicationService, IndividualAccountablePersonModel, OrganisationAccountablePersonModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';

@Component({
  selector: 'hse-accountable-person',
  templateUrl: './accountable-person.component.html'
})
export class AccountablePersonComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'accountable-person';

  accountablePersonHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    this.accountablePersonHasErrors = !this.applicationService.currentAccountablePerson.Type;
    return !this.accountablePersonHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let nextRoute = this.getNextRoute();
    this.initialiseAccountablePerson();
    return navigationService.navigateRelative(nextRoute, activatedRoute);
  }

  initialiseAccountablePerson() {
    let type = this.applicationService.currentAccountablePerson.Type;
    if (type === 'organisation')
      this.applicationService.castDownAccountablePersonTo<OrganisationAccountablePersonModel>();
    else
      this.applicationService.castDownAccountablePersonTo<IndividualAccountablePersonModel>();
    this.applicationService.currentAccountablePerson.Type = type;
  }

  getNextRoute() {
    return this.applicationService.currentAccountablePerson.Type === 'organisation'
      ? 'organisation-type'
      : 'individual-name';
  }

}
