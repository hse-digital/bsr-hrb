import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/helpers/base-form.component';
import { BuildingRegistrationService } from 'src/app/services/building-registration.service';

@Component({
  templateUrl: './contact-phone.component.html'
})
export class ContactPhoneComponent extends BaseFormComponent {
  static route: string = "contact-phone";

  constructor(router: Router, public registrationService: BuildingRegistrationService) {
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
}
