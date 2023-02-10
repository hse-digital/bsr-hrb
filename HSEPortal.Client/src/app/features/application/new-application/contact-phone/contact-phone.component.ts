import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  templateUrl: './contact-phone.component.html'
})
export class ContactPhoneComponent extends BaseComponent {
  static route: string = "contact-phone";

  constructor(router: Router, public registrationService: ApplicationService) {
    super(router);
  }

  nextScreenRoute: string = '/application/new/contact-email';
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
    return this.registrationService.model.ContactPhoneNumber?.replaceAll(' ', '') ?? '';
  }

  override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let hasFirstName: boolean = !!this.registrationService.model.ContactFirstName;
    let hasLastName: boolean = !!this.registrationService.model.ContactLastName;

    return hasFirstName && hasLastName;
  }
}
