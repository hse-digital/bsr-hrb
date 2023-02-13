import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from '../../../../helpers/has-next-page.interface';

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
    this.accountablePersonHasErrors = !this.applicationService.currentAccountablePerson;
    return !this.accountablePersonHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let nextRoute = this.getNextRoute();
    return navigationService.navigate(nextRoute);
  }
  
  getNextRoute() {
    return this.applicationService.currentAccountablePerson.Type === 'organisation'
      ? '/application/accountable-person'
      : '/application/accountable-person';
  }

}
