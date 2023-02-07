import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/helpers/base-form.component';
import { BuildingRegistrationService } from '../../../services/building-registration/building-registration.service';

@Component({
  templateUrl: './contact-details-name.component.html'
})
export class ContactDetailsNameComponent extends BaseFormComponent {

  constructor(router: Router, private buildingRegistrationService: BuildingRegistrationService) {
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

  updateContactFirstName(contactFirstName: string) {
    this.buildingRegistrationService.setContactFirstName(contactFirstName);
  }

  updateContactLastName(contactLastName: string) {
    this.buildingRegistrationService.setContactLastName(contactLastName);
  }
}
