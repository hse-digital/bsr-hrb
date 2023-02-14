import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { EmailValidator } from 'src/app/helpers/validators/email-validator';
import { PhoneNumberValidator } from 'src/app/helpers/validators/phone-number-validator';

@Component({
  selector: 'hse-individual-contact-details-ap',
  templateUrl: './individual-contact-details-ap.component.html'
})
export class IndividualContactDetailsApComponent extends BaseComponent implements IHasNextPage {

  static route: string = 'individual-contact-details';

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
    let emailValidator = new EmailValidator();
    this.errors.email.hasErrors = true;
    if (!email) {
      this.errors.email.errorText = 'Enter your email address';
    } else if (!emailValidator.isValid(email)) {
      this.errors.email.errorText = 'You must enter an email address in the correct format, for example \'name@example.com\''; 
    } else {
      this.errors.email.hasErrors = false;
    }

    return !this.errors.email.hasErrors;
  }

  isPhoneNumberValid(phone: string) {
    let phoneValidator = new PhoneNumberValidator();
    this.errors.phoneNumber.hasErrors = true;
    if (!phone) {
      this.errors.phoneNumber.errorText = 'Enter your telephone number';
    } else if (!phoneValidator.isValid(phone)) {
      this.errors.phoneNumber.errorText = 'You must enter a UK telephone number. For example, \'01632 960 001\', \'07700 900 982\' or \'+44 808 157 0192\'';
    } else {
      this.errors.phoneNumber.hasErrors = false;
    }
    return !this.errors.phoneNumber.hasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return this.navigationService.navigateRelative('individual-address', activatedRoute);
  }

}
