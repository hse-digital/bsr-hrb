import { Component, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  templateUrl: './contact-name.component.html'
})
export class ContactNameComponent extends BaseComponent {
  static route: string = "contact-name";

  constructor(router: Router, applicationService: ApplicationService) {
    super(router, applicationService);
  }

  nextScreenRoute: string = '/application/new/contact-phone';
  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  canContinue() {
    this.firstNameInError = !this.applicationService.model.ContactFirstName;
    this.lastNameInError = !this.applicationService.model.ContactLastName;

    return !this.firstNameInError && !this.lastNameInError;
  }

  override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return !!this.applicationService.model.BuildingName;
  }
}