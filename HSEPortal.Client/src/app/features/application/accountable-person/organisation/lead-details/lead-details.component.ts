import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApHelper } from "src/app/helpers/ap-helper";
import { EmailValidator } from "src/app/helpers/validators/email-validator";
import { FieldValidations } from "src/app/helpers/validators/fieldvalidations";
import { PhoneNumberValidator } from "src/app/helpers/validators/phone-number-validator";
import { ApplicationService } from "src/app/services/application.service";
import { AddAccountablePersonComponent } from "../../add-accountable-person/add-accountable-person.component";
import { PageComponent } from "src/app/helpers/page.component";
import { ActingForSameAddressComponent } from "../acting-for-same-address/acting-for-same-address.component";

export type AccountableLeadPersonJob = { LeadEmail?: string, LeadPhoneNumber?: string, LeadJobRole?: string }

@Component({
  templateUrl: './lead-details.component.html'
})
export class LeadDetailsComponent extends PageComponent<AccountableLeadPersonJob> {
  static route: string = 'lead-details';
  static title: string = "PAP organisation lead contact details - Register a high-rise building - GOV.UK";



  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  } 

  papName?: string;

  emailHasErrors: boolean = false;
  phoneHasErrors: boolean = false;
  jobRoleHasErrors: boolean = false;

  emailErrorText!: string;
  phoneErrorText!: string;
  jobRoleErrorText!: string;

  override onInit(applicationService: ApplicationService): void {
    this.model = {
      LeadEmail: this.applicationService.currentAccountablePerson.LeadEmail,
      LeadPhoneNumber: this.applicationService.currentAccountablePerson.LeadPhoneNumber,
      LeadJobRole: this.applicationService.currentAccountablePerson.LeadJobRole
    };
    this.papName = `${this.applicationService.currentAccountablePerson.LeadFirstName} ${this.applicationService.currentAccountablePerson.LeadLastName}`;
    this.emailErrorText = `Enter ${this.papName}'s email address`;
    this.phoneErrorText = `Enter ${this.papName}'s telephone number`;
    this.jobRoleErrorText = `Select ${this.papName}'s job role`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentAccountablePerson.LeadEmail = this.model?.LeadEmail;
    this.applicationService.currentAccountablePerson.LeadPhoneNumber = this.model?.LeadPhoneNumber;
    this.applicationService.currentAccountablePerson.LeadJobRole = this.model?.LeadJobRole;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService)
      && ApHelper.isOrganisation(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    this.emailHasErrors = !this.isEmailValid(this.model?.LeadEmail);
    this.phoneHasErrors = !this.isPhoneNumberValid(this.model?.LeadPhoneNumber);
    this.jobRoleHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.model?.LeadJobRole);

    return !this.emailHasErrors && !this.phoneHasErrors && !this.jobRoleHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.isChangeAmendmentInProgress) {
      return this.navigationService.navigateRelative(ActingForSameAddressComponent.route, this.activatedRoute);
    }

    return this.navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, this.activatedRoute);
  }

  isEmailValid(email: string | undefined): boolean {
    var inError = true;
    if (!FieldValidations.IsNotNullOrWhitespace(email)) {
      this.emailErrorText = `Enter ${this.papName}'s email address`;
    } else if (!EmailValidator.isValid(email!)) {
      this.emailErrorText = 'You must enter an email address in the correct format, for example \'name@example.com\'';
    } else {
      inError = false;
    }

    return !inError;
  }

  isPhoneNumberValid(phone: string | undefined) {
    var inError = true;
    if (!FieldValidations.IsNotNullOrWhitespace(phone)) {
      this.phoneErrorText = `Enter ${this.papName}'s telephone number`;
    } else if (!PhoneNumberValidator.isValid(phone!)) {
      this.phoneErrorText = 'You must enter a UK telephone number. For example, \'01632 960 001\', \'07700 900 982\' or \'+44 808 157 0192\'';
    } else {
      inError = false;
    }

    return !inError;
  }
} 
