import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/helpers/base.component';
import { BuildingRegistrationService } from 'src/app/services/building-registration.service';

@Component({
  templateUrl: './security-code.component.html'
})
export class SecurityCodeComponent extends BaseComponent {
  static route: string = "security-code";

  nextScreenRoute: string = '/application/123/sections';
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

