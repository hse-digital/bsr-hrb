import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from '../../helpers/base-form.component';
import { BuildingRegistrationService } from '../../services/building-registration/building-registration.service';

@Component({
  selector: 'hse-return-security',
  templateUrl: './return-security.component.html'
})
export class ReturnSecurityComponent extends BaseFormComponent {

  nextScreenRoute: string = '/building-registration/return-security';

  building: { securityCode?: string, email?: string } = {}

  errors = {
    securityCode: { hasError: false, errorText: '' }
  }

  constructor(router: Router, public buildingRegistrationService: BuildingRegistrationService) {
    super(router);
    this.building.email = this.buildingRegistrationService.model.ContactEmailAddress;
  }

  canContinue(): boolean {
    this.isSecurityCodeValid();
    return !this.errors.securityCode.hasError;
  }

  isSecurityCodeValid(): boolean {
    this.errors.securityCode.hasError = true;
    if (!this.building.securityCode) {
      this.errors.securityCode.errorText = 'Enter the security code';
    } else if (!Number(this.building.securityCode) || this.building.securityCode.length != 6) {
      this.errors.securityCode.errorText = 'Security code must be a 6 digit number';
    } else if (!this.doesSecurityCodeMatch()) {
      this.errors.securityCode.errorText = 'Enter the correct security code';
    } else if (this.hasSecurityCodeExpired()) {
      this.errors.securityCode.errorText = 'This security code has expired';
    } else {
      this.errors.securityCode.hasError = false;
    }
    return !this.errors.securityCode.hasError;
  }

  doesSecurityCodeMatch(): boolean {
    return true;
  }

  hasSecurityCodeExpired(): boolean {
    return false
  }
}

