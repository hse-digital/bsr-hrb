import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApHelper } from "src/app/helpers/ap-helper";
import { EmailValidator } from "src/app/helpers/validators/email-validator";
import { PhoneNumberValidator } from "src/app/helpers/validators/phone-number-validator";
import { ApplicationService } from "src/app/services/application.service";
import { AddAccountablePersonComponent } from "../../add-accountable-person/add-accountable-person.component";
import { PageComponent } from "src/app/helpers/page.component";

export type AccountableNamedPersonDetails = { NamedContactEmail?: string, NamedContactPhoneNumber?: string }

@Component({
  templateUrl: './named-contact-details.component.html'
})
export class OrganisationNamedContactDetailsComponent extends PageComponent<AccountableNamedPersonDetails> {
  static route: string = 'named-contact-details';
  static title: string = "AP organisation named contact details - Register a high-rise building - GOV.UK";



  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  } 

  errors = {
    email: { hasErrors: false, errorText: '' },
    phoneNumber: { hasErrors: false, errorText: '' }
  };

  override onInit(applicationService: ApplicationService): void {
    this.model = {
      NamedContactEmail: this.applicationService.currentAccountablePerson.NamedContactEmail,
      NamedContactPhoneNumber: this.applicationService.currentAccountablePerson.NamedContactPhoneNumber
    };
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentAccountablePerson.NamedContactEmail = this.model?.NamedContactEmail;
    this.applicationService.currentAccountablePerson.NamedContactPhoneNumber = this.model?.NamedContactPhoneNumber;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
      && ApHelper.isOrganisation(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    let emailValid = this.isEmailValid(this.model?.NamedContactEmail);
    let phoneValid = this.isPhoneNumberValid(this.model?.NamedContactPhoneNumber);

    return emailValid && phoneValid;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, this.activatedRoute);
  }

  isEmailValid(email?: string): boolean {
    this.errors.email.hasErrors = true;
    if (!email) {
      this.errors.email.errorText = `Enter ${this.getNamedContactName()}'s email address`;
    } else if (!EmailValidator.isValid(email)) {
      this.errors.email.errorText = 'You must enter an email address in the correct format, for example \'name@example.com\'';
    } else {
      this.errors.email.hasErrors = false;
    }

    return !this.errors.email.hasErrors;
  }

  isPhoneNumberValid(phone?: string) {
    this.errors.phoneNumber.hasErrors = true;
    if (!phone) {
      this.errors.phoneNumber.errorText = `Enter ${this.getNamedContactName()}'s telephone number`;
    } else if (!PhoneNumberValidator.isValid(phone)) {
      this.errors.phoneNumber.errorText = 'You must enter a UK telephone number. For example, \'01632 960 001\', \'07700 900 982\' or \'+44 808 157 0192\'';
    } else {
      this.errors.phoneNumber.hasErrors = false;
    }
    return !this.errors.phoneNumber.hasErrors;
  }

  getNamedContactName() {
    return `${this.applicationService.currentAccountablePerson.NamedContactFirstName} ${this.applicationService.currentAccountablePerson.NamedContactLastName}`;
  }
}
