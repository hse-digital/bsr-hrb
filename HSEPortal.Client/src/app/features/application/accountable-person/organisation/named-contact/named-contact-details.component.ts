import { Component, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { EmailValidator } from "src/app/helpers/validators/email-validator";
import { PhoneNumberValidator } from "src/app/helpers/validators/phone-number-validator";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AddAccountablePersonComponent } from "../../add-accountable-person/add-accountable-person.component";

@Component({
  templateUrl: './named-contact-details.component.html'
})
export class OrganisationNamedContactDetailsComponent extends BaseComponent implements IHasNextPage {
  static route: string = 'named-contact-details';

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  errors = {
    email: { hasErrors: false, errorText: '' },
    phoneNumber: { hasErrors: false, errorText: '' }
  };

  canContinue(): boolean {
    let email = this.applicationService.currentAccountablePerson.NamedContactEmail ?? '';
    let phone = this.applicationService.currentAccountablePerson.NamedContactPhoneNumber ?? '';

    let emailValid = this.isEmailValid(email);
    let phoneValid = this.isPhoneNumberValid(phone);

    return emailValid && phoneValid;
  }

  isEmailValid(email: string): boolean {
    let emailValidator = new EmailValidator();
    this.errors.email.hasErrors = true;
    if (!email) {
      this.errors.email.errorText = `Enter ${this.getNamedContactName()}'s email address`;
    } else if (!emailValidator.isValid(email)) {
      this.errors.email.errorText = 'You must enter an email address in the correct format, for example \'name@example.com\'';
    } else {
      this.errors.email.hasErrors = false;
    }

    return !this.errors.email.hasErrors;
  }

  isPhoneNumberValid(phone: string) {
    let phoneValidator = new PhoneNumberValidator();
    this.errors.phoneNumber.hasErrors = true;
    if (!phone) {
      this.errors.phoneNumber.errorText = `Enter ${this.getNamedContactName()}'s telephone number`;
    } else if (!phoneValidator.isValid(phone)) {
      this.errors.phoneNumber.errorText = 'You must enter a UK telephone number. For example, \'01632 960 001\', \'07700 900 982\' or \'+44 808 157 0192\'';
    } else {
      this.errors.phoneNumber.hasErrors = false;
    }
    return !this.errors.phoneNumber.hasErrors;
  }

  getNamedContactName() {
    return `${this.applicationService.currentAccountablePerson.NamedContactFirstName} ${this.applicationService.currentAccountablePerson.NamedContactLastName}`;
  }

  async navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, activatedRoute);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentAccountablePerson.SectionsAccountability && this.applicationService.currentAccountablePerson.Type == "organisation"
      && !!this.applicationService.currentAccountablePerson.NamedContactFirstName && !!this.applicationService.currentAccountablePerson.NamedContactLastName;
  }
}
