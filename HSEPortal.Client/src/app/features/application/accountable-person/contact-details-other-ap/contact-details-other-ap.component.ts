import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-contact-details-other-ap',
  templateUrl: './contact-details-other-ap.component.html'
})
export class ContactDetailsOtherApComponent extends BaseComponent implements IHasNextPage {

  static route: string = 'other-accountable-person-details';

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  errors = {
    contactDetailsAreEmpty: false,
    email: { hasErrors: false, errorText: '' },
    phoneNumber: { hasErrors: false, errorText: ''}
  };

  canContinue(): boolean {
    let email = this.applicationService.currentAccountablePerson.Email ?? '';
    let phone = this.applicationService.currentAccountablePerson.PhoneNumber ?? '';
    let canContinue = false;

    if (!email && !phone) {
      this.errors.contactDetailsAreEmpty = true;
    } else {
      this.errors.contactDetailsAreEmpty = false;
      let emailValid = this.isEmailValid(email);
      let phoneValid = this.isPhoneNumberValid(phone);
      canContinue = emailValid && phoneValid;
    }

    return canContinue;
  }

  isEmailValid(email: string): boolean {
    this.errors.email.hasErrors = true;
    if (!email) {
      this.errors.email.errorText = 'Enter your email address';
    } else if (!this.isEmailFormatValid(email)) {
      this.errors.email.errorText = 'You must enter an email address in the correct format, for example \'name@example.com\''; 
    } else {
      this.errors.email.hasErrors = false;
    }

    return !this.errors.email.hasErrors;
  }

  isEmailFormatValid(email: string): boolean {
    const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
    return emailRegex.test(email);
  }

  isPhoneNumberValid(phone: string) {    
    this.errors.phoneNumber.hasErrors = true;
    if (!phone) {
      this.errors.phoneNumber.errorText = 'Enter your telephone number';
    } else if (!this.isPhoneNumberFormatValid(phone)) {
      this.errors.phoneNumber.errorText = 'You must enter a UK telephone number. For example, \'01632 960 001\', \'07700 900 982\' or \'+44 808 157 0192\'';
    } else {
      this.errors.phoneNumber.hasErrors = false;
    }
    return !this.errors.phoneNumber.hasErrors;
  }

  _expectedPhonePatterns = [
    { prefix: '+44', length: 13 },
    { prefix: '0', length: 11 },
  ]

  isPhoneNumberFormatValid(phone: string): boolean {
    let phoneNumber = this.cleanPhoneNumber(phone);
    if (!Number(phoneNumber)) return false;

    return this._expectedPhonePatterns.find((pattern) => phoneNumber.startsWith(pattern.prefix) && phoneNumber.length == pattern.length) != undefined;
  }

  cleanPhoneNumber(phone: string): string {
    return phone?.replaceAll(' ', '') ?? '';
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return this.navigationService.navigate('/application/other-accountable-person-details');
  }

}
