import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/helpers/base.component';
import { BuildingRegistrationService } from 'src/app/services/building-registration.service';

@Component({
  templateUrl: './contact-name.component.html'
})
export class ContactNameComponent extends BaseComponent {
  static route: string = "contact-name";

  constructor(router: Router, public registrationService: BuildingRegistrationService) {
    super(router);
  }

  nextScreenRoute: string = '/application/new/contact-phone';
  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  canContinue() {
    this.firstNameInError = !this.registrationService.model.ContactFirstName;
    this.lastNameInError = !this.registrationService.model.ContactLastName;

    return !this.firstNameInError && !this.lastNameInError;
  }

  override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return !!this.registrationService.model.BuildingName;
  }
}
