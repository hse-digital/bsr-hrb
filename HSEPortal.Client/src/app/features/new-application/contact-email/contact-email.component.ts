import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { EmailValidator } from 'src/app/helpers/validators/email-validator';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from 'src/app/services/title.service';

@Component({
  templateUrl: './contact-email.component.html'
})
export class ContactEmailComponent extends BaseComponent implements IHasNextPage {
  static route: string = "contact-email";
  static title: string = "Your email address - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
    this.updateOnSave = false;
  }

  emailHasErrors = false;

  sendingRequest = false;

  canContinue(): boolean {
    let emailValidator = new EmailValidator();
    let email = this.applicationService.model.ContactEmailAddress;
    this.emailHasErrors = !email || !emailValidator.isValid(email);
    return !this.emailHasErrors;
  }

  override async saveAndContinue(): Promise<any> {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      this.sendingRequest = true;

      await this.applicationService.sendVerificationEmail(this.applicationService.model.ContactEmailAddress!);
      await this.navigateToNextPage(this.navigationService, this.activatedRoute);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.model.ContactPhoneNumber;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('verify', activatedRoute);
  }
}
