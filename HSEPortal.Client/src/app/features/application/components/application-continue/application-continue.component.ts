import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './application-continue.component.html'
})
export class ApplicationContinueComponent extends BaseComponent {
  static route: string = "continue";

  nextScreenRoute: string = '/application/security-code';

  errors = {
    emailAddress: { hasError: false, errorText: '' },
    applicationNumber: { hasError: false, errorText: '' }
  }
  model: { emailAddress?: string, applicationNumber?: string } = {}

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  canContinue(): boolean {
    this.isApplicationNumberValid();
    this.isEmailAddressValid();
    return !this.errors.emailAddress.hasError && !this.errors.applicationNumber.hasError;
  }

  async isApplicationNumberValid() {
    this.errors.applicationNumber.hasError = true;
    if (!this.model.applicationNumber) {
      this.errors.applicationNumber.errorText = 'Enter the application number';
    } else if (this.model.applicationNumber.length != 12) {
      this.errors.applicationNumber.errorText = 'Application number must be 12 characters';
    } else if (!(await this.doesApplicationNumberMatchEmail())) {
      this.errors.emailAddress.errorText = 'Application number doesn\'t match this email address.Enter the correct application number';
    } else {
      this.errors.applicationNumber.hasError = false;
    }

    return !this.errors.applicationNumber.hasError;
  }

  isEmailAddressValid() {
    this.errors.emailAddress.hasError = false;
    if (!this.model.emailAddress) {
      this.errors.emailAddress.errorText = 'Enter your email address';
      this.errors.emailAddress.hasError = true;
    }

    return !this.errors.emailAddress.hasError;
  }

  async doesApplicationNumberMatchEmail(): Promise<boolean> {
    return await this.applicationService.isApplicationNumberValid(this.model.emailAddress!, this.model.applicationNumber!);
  }
}
