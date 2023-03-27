import { Component, QueryList, ViewChildren } from '@angular/core';
import { TitleService } from 'src/app/services/title.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';

@Component({
  templateUrl: './contact-email-validation.component.html'
})
export class ContactEmailValidationComponent extends BaseComponent implements IHasNextPage {
  static route: string = "verify";
  static title: string = "Verify your email address - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  otpToken = "";
  otpError = false;
  sendingRequest = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
    this.updateOnSave = false;
  }

  canContinue(): boolean {
    return this.otpToken !== undefined && this.otpToken.length == 6;
  }

  getOtpError() {
    return this.otpError ? 'Enter the correct security code' : 'You must enter your 6 digit security code';
  }

  override async saveAndContinue(): Promise<any> {
    this.processing = true;
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      try {
        this.screenReaderNotification();
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
      this.summaryError?.first?.focus();
    }

    this.processing = false;
  }

  override canAccess(_: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ContactEmailAddress);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigate(`application/${this.applicationService.model.id}`);
  }
}

