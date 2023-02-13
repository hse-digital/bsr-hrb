import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { IHasPreviousPage } from 'src/app/helpers/has-previous-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './contact-phone.component.html'
})
export class ContactPhoneComponent extends BaseComponent implements IHasNextPage {
  static route: string = "contact-phone";

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  phoneNumberHasErrors = false;
  canContinue(): boolean {
    this.phoneNumberHasErrors = !this.isPhoneNumberValid();
    return !this.phoneNumberHasErrors;
  }

  private _expectedPhonePatterns = [
    { prefix: '+44', length: 13 },
    { prefix: '0', length: 11 },
  ]

  private isPhoneNumberValid(): boolean {
    let phoneNumber = this.cleanPhoneNumber();
    if (!Number(phoneNumber)) return false;

    return this._expectedPhonePatterns.find((pattern) => phoneNumber.startsWith(pattern.prefix) && phoneNumber.length == pattern.length) != undefined;
  }

  private cleanPhoneNumber(): string {
    return this.applicationService.model.ContactPhoneNumber?.replaceAll(' ', '') ?? '';
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    let hasFirstName: boolean = !!this.applicationService.model.ContactFirstName;
    let hasLastName: boolean = !!this.applicationService.model.ContactLastName;

    return hasFirstName && hasLastName;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('contact-email', activatedRoute);
  }
}
