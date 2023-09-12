import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  templateUrl: './contact-email-validation.component.html'
})
export class ContactEmailValidationComponent extends PageComponent<string> {

  static route: string = "verify";
  static title: string = "Verify your email address - Register a high-rise building - GOV.UK";

  otpToken = "";
  otpError = false;
  sendingRequest = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
    this.updateOnSave = false;
  }

  getOtpError() {
    return this.otpError ? 'Enter the correct security code' : 'You must enter your 6 digit security code';
  }

  override async saveAndContinue(): Promise<any> {
    this.processing = true;
    this.hasErrors = !this.isValid();
    if (!this.hasErrors) {
      try {
        this.triggerScreenReaderNotification();
        this.sendingRequest = true;
        await this.applicationService.validateOTPToken(this.otpToken, this.applicationService.model.ContactEmailAddress!);
        await this.applicationService.registerNewBuildingApplication();
        await this.navigationService.navigate(`application/${this.applicationService.model.id}`);
      } catch {
        this.sendingRequest = false;
        this.hasErrors = true;
        this.otpError = true;
      }
    } else {
      this.focusAndUpdateErrors();
    }

    this.processing = false;
  }

  override onInit(applicationService: ApplicationService): void { }
  override async onSave(applicationService: ApplicationService): Promise<void> { }
  
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ContactEmailAddress);
  }
  
  override isValid(): boolean {
    this.otpToken = this.otpToken.trim();
    return this.otpToken !== undefined && this.otpToken.length == 6;
  }
  
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate(`application/${this.applicationService.model.id}`);
  }
}

