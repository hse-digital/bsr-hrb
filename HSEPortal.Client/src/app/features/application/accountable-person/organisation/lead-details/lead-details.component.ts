import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { EmailValidator } from "src/app/helpers/validators/email-validator";
import { PhoneNumberValidator } from "src/app/helpers/validators/phone-number-validator";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { AddAccountablePersonComponent } from "../../add-accountable-person/add-accountable-person.component";

@Component({
  templateUrl: './lead-details.component.html'
})
export class LeadDetailsComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'lead-details';
  static title: string = "PAP organisation lead contact details - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  errors = {
    email: { hasErrors: false, errorText: '' },
    phoneNumber: { hasErrors: false, errorText: '' },
    jobRole: { hasErrors: false, errorText: 'Select your job role' }
  };

  canContinue(): boolean {
    let email = this.applicationService.currentAccountablePerson.LeadEmail ?? '';
    let phone = this.applicationService.currentAccountablePerson.LeadPhoneNumber ?? '';

    let emailValid = this.isEmailValid(email);
    let phoneValid = this.isPhoneNumberValid(phone);
    let jobRoleValid = this.applicationService.currentAccountablePerson.LeadJobRole != undefined;
    this.errors.jobRole.hasErrors = !jobRoleValid;

    return emailValid && phoneValid && jobRoleValid;
  }

  isEmailValid(email: string): boolean {
    this.errors.email.hasErrors = true;
    if (!email) {
      this.errors.email.errorText = 'Enter your email address';
    } else if (!EmailValidator.isValid(email)) {
      this.errors.email.errorText = 'You must enter an email address in the correct format, for example \'name@example.com\'';
    } else {
      this.errors.email.hasErrors = false;
    }

    return !this.errors.email.hasErrors;
  }

  isPhoneNumberValid(phone: string) {
    this.errors.phoneNumber.hasErrors = true;
    if (!phone) {
      this.errors.phoneNumber.errorText = 'Enter your telephone number';
    } else if (!PhoneNumberValidator.isValid(phone)) {
      this.errors.phoneNumber.errorText = 'You must enter a UK telephone number. For example, \'01632 960 001\', \'07700 900 982\' or \'+44 808 157 0192\'';
    } else {
      this.errors.phoneNumber.hasErrors = false;
    }
    return !this.errors.phoneNumber.hasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, activatedRoute);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentAccountablePerson.LeadFirstName && !!this.applicationService.currentAccountablePerson.LeadLastName;
  }

} 
