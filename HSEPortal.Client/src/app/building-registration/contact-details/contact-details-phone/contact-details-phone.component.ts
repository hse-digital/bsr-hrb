import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/helpers/base-form.component';
import { BuildingRegistrationService } from '../../../services/building-registration/building-registration.service';

@Component({
  templateUrl: './contact-details-phone.component.html'
})
export class ContactDetailsPhoneComponent extends BaseFormComponent {

  constructor(router: Router, private buildingRegistrationService: BuildingRegistrationService) {
    super(router);
  }

  nextScreenRoute: string = '/building-registration/contact-details/email';
  contactDetails: { phoneNumber?: string } = {};
  phoneNumberHasErrors = false;

  canContinue(): boolean {
    this.phoneNumberHasErrors = !this.isPhoneNumberValid();
    return !this.phoneNumberHasErrors;
  }

  updateContactPhoneNumber(contactPhoneNumber: string) {
    this.buildingRegistrationService.setContactPhoneNumber(contactPhoneNumber);
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
    return this.contactDetails.phoneNumber?.replaceAll(' ', '') ?? '';
  }
}
