import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/helpers/base-form.component';
import { BuildingRegistrationService } from '../../../services/building-registration/building-registration.service';

@Component({
  templateUrl: './contact-details-name.component.html'
})
export class ContactDetailsNameComponent extends BaseFormComponent {

  constructor(router: Router, public registrationService: BuildingRegistrationService) {
    super(router);
  }

  nextScreenRoute: string = '/building-registration/contact-details/phone';
  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  canContinue() {
    this.firstNameInError = !this.registrationService.model.ContactFirstName;
    this.lastNameInError = !this.registrationService.model.ContactLastName;

    return !this.firstNameInError && !this.lastNameInError;
  }
}
