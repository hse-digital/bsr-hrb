import { Component, Input } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ApHelper } from "src/app/helpers/ap-helper";
import { EmailValidator } from "src/app/helpers/validators/email-validator";
import { FieldValidations } from "src/app/helpers/validators/fieldvalidations";
import { PhoneNumberValidator } from "src/app/helpers/validators/phone-number-validator";
import { ApplicationService } from "src/app/services/application.service";
import { ApAddressComponent } from "../ap-address/ap-address.component";
import { PageComponent } from "src/app/helpers/page.component";

type AccountablePersonDetails = { Email?: string, PhoneNumber?: string}

@Component({
  selector: 'ap-details',
  templateUrl: './ap-details.component.html'
})
export class ApDetailsComponent extends PageComponent<AccountablePersonDetails> {
  static route: string = 'details';
  static title: string = "AP individual contact details - Register a high-rise building - GOV.UK";

  @Input() nextRoute?: string;
  @Input() pap: boolean = false;



  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  } 

  papName?: string;

  emailHasErrors: boolean = false;
  emailErrorText: string = `Enter ${this.papName}'s email address`;

  phoneHasErrors: boolean = false;
  phoneErrorText: string = `Enter ${this.papName}'s telephone number`;

  override onInit(applicationService: ApplicationService): void {
    this.model = {};
    this.model.Email = this.applicationService.currentAccountablePerson.Email;
    this.model.PhoneNumber = this.applicationService.currentAccountablePerson.PhoneNumber;
    
    this.papName = `${this.applicationService.currentAccountablePerson.FirstName} ${this.applicationService.currentAccountablePerson.LastName}`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentAccountablePerson.Email = this.model?.Email;
    this.applicationService.currentAccountablePerson.PhoneNumber = this.model?.PhoneNumber;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService);
  }

  override isValid(): boolean {
    let email = this.model?.Email;
    let phone = this.model?.PhoneNumber;

    this.emailHasErrors = !this.isEmailValid(email);
    this.phoneHasErrors = !this.isPhoneNumberValid(phone);

    return !this.emailHasErrors && !this.phoneHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(this.nextRoute ?? ApAddressComponent.route, this.activatedRoute);
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
