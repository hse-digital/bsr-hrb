import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PhoneNumberValidator } from 'src/app/helpers/validators/phone-number-validator';
import { GovukErrorSummaryComponent } from 'hse-angular';

@Component({
  templateUrl: './contact-phone.component.html'
})
export class ContactPhoneComponent extends BaseComponent implements IHasNextPage {
  static route: string = "contact-phone";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  phoneNumberHasErrors = false;
  canContinue(): boolean {
    let phone = this.applicationService.model.ContactPhoneNumber;
    let phoneValidator = new PhoneNumberValidator();
    this.phoneNumberHasErrors = !phoneValidator.isValid(phone?.toString() ?? '');
    return !this.phoneNumberHasErrors;
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    let hasFirstName: boolean = !!this.applicationService.model.ContactFirstName;
    let hasLastName: boolean = !!this.applicationService.model.ContactLastName;

    return hasFirstName && hasLastName;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('contact-email', activatedRoute);
  }
}
