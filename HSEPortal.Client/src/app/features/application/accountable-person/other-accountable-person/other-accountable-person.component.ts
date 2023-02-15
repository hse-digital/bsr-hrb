import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService, IndividualAccountablePersonModel, OrganisationAccountablePersonModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from '../../../../helpers/has-next-page.interface';

@Component({
  selector: 'hse-other-accountable-person',
  templateUrl: './other-accountable-person.component.html'
})
export class OtherAccountablePersonComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'other-accountable-person';

  otherAccountablePersonHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return true;
  }

  canContinue(): boolean {
    this.otherAccountablePersonHasErrors = !this.applicationService.currentAccountablePerson.Type;
    return !this.otherAccountablePersonHasErrors;
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
