import { Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { ApHelper } from "src/app/helpers/ap-helper";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { EmailValidator } from "src/app/helpers/validators/email-validator";
import { FieldValidations } from "src/app/helpers/validators/fieldvalidations";
import { PhoneNumberValidator } from "src/app/helpers/validators/phone-number-validator";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from 'src/app/services/title.service';
import { ApAddressComponent } from "../ap-address/ap-address.component";

@Component({
  selector: 'ap-details',
  templateUrl: './ap-details.component.html'
})
export class ApDetailsComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'details';
  static title: string = "AP individual contact details - Register a high-rise building - GOV.UK";

  @Input() nextRoute?: string;
  @Input() pap: boolean = false;

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  papName?: string;
  ngOnInit(): void {
    this.papName = `${this.applicationService.currentAccountablePerson.FirstName} ${this.applicationService.currentAccountablePerson.LastName}`;
  }

  emailHasErrors: boolean = false;
  emailErrorText: string = `Enter ${this.papName}'s email address`;

  phoneHasErrors: boolean = false;
  phoneErrorText: string = `Enter ${this.papName}'s telephone number`;

  canContinue(): boolean {
    let email = this.applicationService.currentAccountablePerson.Email;
    let phone = this.applicationService.currentAccountablePerson.PhoneNumber;

    this.emailHasErrors = !this.isEmailValid(email);
    this.phoneHasErrors = !this.isPhoneNumberValid(phone);

    return !this.emailHasErrors && !this.phoneHasErrors;
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

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(this.nextRoute ?? ApAddressComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService);
  }
}
