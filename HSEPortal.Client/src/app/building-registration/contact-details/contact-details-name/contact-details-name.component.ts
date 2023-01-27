import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/helpers/base-form.component';

@Component({
  templateUrl: './contact-details-name.component.html'
})
export class ContactDetailsNameComponent extends BaseFormComponent {

  constructor(router: Router) {
    super(router);
  }

  nextScreenRoute: string = '/building-registration/contact-details/phone';
  contactDetails: { firstName?: string, lastName?: string } = {};
  
  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  canContinue() {
    this.firstNameInError = !this.contactDetails.firstName;
    this.lastNameInError = !this.contactDetails.lastName;

    return !this.firstNameInError && !this.lastNameInError;
  }
}