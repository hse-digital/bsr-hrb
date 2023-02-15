import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-add-accountable-person',
  templateUrl: './add-accountable-person.component.html',
})
export class AddAccountablePersonComponent extends BaseComponent implements IHasNextPage{
  static route: string = 'add-accountable-person';

  model: { addAccountablePerson?: string } = {}
  addAccountablePersonHasError = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return true;
  }

  canContinue(): boolean {
    this.addAccountablePersonHasError = !this.model.addAccountablePerson;
    return !this.addAccountablePersonHasError;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let route = this.model.addAccountablePerson ?? '';
    if (this.model.addAccountablePerson === 'other-accountable-person') {
      let id = this.applicationService.initializeNewAccountablePerson();
      route = `../${id}/${route}`;
      console.log(this.applicationService.model);
    }
    return this.navigationService.navigateRelative(route, activatedRoute);
  }

}
