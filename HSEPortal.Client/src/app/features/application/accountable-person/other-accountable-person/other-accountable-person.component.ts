import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IHasNextPage } from '../../../../helpers/has-next-page.interface';

@Component({
  selector: 'hse-other-accountable-person',
  templateUrl: './other-accountable-person.component.html'
})
export class OtherAccountablePersonComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'other-accountable-person';

  otherAccountablePersonHasErrors = false;
  accountablePersonType?: string;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return true;
  }

  canContinue(): boolean {
    this.otherAccountablePersonHasErrors = !this.accountablePersonType;
    return !this.otherAccountablePersonHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let accountablePerson = this.applicationService.startNewAccountablePerson(this.accountablePersonType!);
    let route = this.accountablePersonType == 'organisation' ? 'organisation-type' : 'individual-name';

    return navigationService.navigateRelative(`${accountablePerson}/${route}`, activatedRoute);
  }
}
