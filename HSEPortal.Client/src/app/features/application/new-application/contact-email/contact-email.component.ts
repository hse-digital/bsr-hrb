import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './contact-email.component.html'
})
export class ContactEmailComponent extends BaseComponent implements IHasNextPage {
  static route: string = "contact-email";

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  nextScreenRoute: string = '';
  emailHasErrors = false;

  sendingRequest = false;

  canContinue(): boolean {
    this.emailHasErrors = !this.applicationService.model.ContactEmailAddress || !this.isEmailValid();
    return !this.emailHasErrors;
  }

  override async saveAndContinue(): Promise<any> {
    this.hasErrors = !this.canContinue();
    if (!this.hasErrors) {
      this.sendingRequest = true;

      await this.applicationService.sendVerificationEmail();
      await this.navigateToNextPage(this.navigationService, this.activatedRoute);
    }
  }

  private isEmailValid(): boolean {
    const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
    return emailRegex.test(this.applicationService.model.ContactEmailAddress ?? '');
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.model.ContactPhoneNumber;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('email-code', activatedRoute);
  }
}
