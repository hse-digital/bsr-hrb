import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/helpers/base-form.component';
import { BuildingRegistrationService } from 'src/app/services/building-registration.service';

@Component({
  templateUrl: './contact-name.component.html'
})
export class ContactNameComponent extends BaseFormComponent {
  static route: string = "contact-name";

  constructor(router: Router, public registrationService: BuildingRegistrationService) {
    super(router);
  }

  nextScreenRoute: string = '/application/new/contact-phone';
  firstNameInError: boolean = false;
  lastNameInError: boolean = false;

  canContinue() {
    this.firstNameInError = !this.registrationService.model.ContactFirstName;
    this.lastNameInError = !this.registrationService.model.ContactLastName;

    return !this.firstNameInError && !this.lastNameInError;
  }
}
