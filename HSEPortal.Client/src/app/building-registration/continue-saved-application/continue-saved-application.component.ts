import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from '../../helpers/base-form.component';
import { BuildingRegistrationService } from '../../services/building-registration/building-registration.service';

@Component({
  selector: 'hse-continue-saved-application',
  templateUrl: './continue-saved-application.component.html',
  styleUrls: ['./continue-saved-application.component.scss']
})
export class ContinueSavedApplicationComponent extends BaseFormComponent {

  nextScreenRoute: string = '/building-registration/continue-saved-application';

  building: { emailAddress?: string, applicationNumber?: string } = {}

  errors = {
    emailAddress: { hasError: false, errorText: '' },
    applicationNumber: { hasError: false, errorText: '' }
  }

  constructor(router: Router, buildingRegistrationService: BuildingRegistrationService) {
    super(router);
  }

  canContinue(): boolean {
    this.isApplicationNumberValid();
    this.isEmailAddressValid();
    return !this.errors.emailAddress.hasError && !this.errors.applicationNumber.hasError;
  }

  isApplicationNumberValid() {
    this.errors.applicationNumber.hasError = true;
    if (!this.building.applicationNumber) {
      this.errors.applicationNumber.errorText = 'Enter the application number';
    } else if (this.building.applicationNumber.length != 12) {
      this.errors.applicationNumber.errorText = 'Application number must be 12 characters';
    } else if (!this.doesApplicationNumberMatchEmail()) {
      this.errors.emailAddress.errorText = 'Application number doesn\'t match this email address.Enter the correct application number';
    } else {
      this.errors.applicationNumber.hasError = false;
    }
    return !this.errors.applicationNumber.hasError;
  }

  isEmailAddressValid() {
    this.errors.emailAddress.hasError = false;
    if (!this.building.emailAddress) {
      this.errors.emailAddress.errorText = 'Enter your email address';
      this.errors.emailAddress.hasError = true;
    }
    return !this.errors.emailAddress.hasError;
  }

  doesApplicationNumberMatchEmail() {
    return true;
  }

}
