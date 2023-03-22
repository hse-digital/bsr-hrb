import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { EmailValidator } from 'src/app/helpers/validators/email-validator';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from 'src/app/services/title.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';

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
  canContinue(): boolean {
    this.emailHasErrors = !EmailValidator.isValid(this.applicationService.model.ContactEmailAddress ?? '');
    return !this.emailHasErrors;
  }

  override async onSave(): Promise<void> {
    await this.applicationService.sendVerificationEmail(this.applicationService.model.ContactEmailAddress!);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ContactPhoneNumber);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('verify', activatedRoute);
  }
}
