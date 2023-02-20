import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { OtherAccountablePersonComponent } from '../other-accountable-person/other-accountable-person.component';

@Component({
  selector: 'hse-add-accountable-person',
  templateUrl: './add-accountable-person.component.html',
})
export class AddAccountablePersonComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'add-more';

  addAccountablePerson?: string;
  addAccountablePersonHasError = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return true;
  }

  canContinue(): boolean {
    this.addAccountablePersonHasError = !this.addAccountablePerson;
    return !this.addAccountablePersonHasError;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let route = this.addAccountablePerson == 'yes' ? OtherAccountablePersonComponent.route : AddAccountablePersonComponent.route;
    return this.navigationService.navigateRelative(route, activatedRoute);
  }

}
