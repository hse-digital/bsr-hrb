import { Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { GovukErrorSummaryComponent } from "hse-angular";
import { BaseComponent } from "src/app/helpers/base.component";
import { IHasNextPage } from "src/app/helpers/has-next-page.interface";
import { EmailValidator } from "src/app/helpers/validators/email-validator";
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

  errors = {
    contactDetailsAreEmpty: false,
    email: { hasErrors: false, errorText: '' },
    phoneNumber: { hasErrors: false, errorText: '' }
  };

  canContinue(): boolean {
    let email = this.applicationService.currentAccountablePerson.Email ?? '';
    let phone = this.applicationService.currentAccountablePerson.PhoneNumber ?? '';
    let canContinue = false;

    if (!email && !phone) {
      this.errors.contactDetailsAreEmpty = true;
    } else {
      this.errors.contactDetailsAreEmpty = false;
      let emailValid = this.isEmailValid(email);
      let phoneValid = this.isPhoneNumberValid(phone);
      canContinue = emailValid && phoneValid;
    }

    return canContinue;
  }

  isEmailValid(email: string): boolean {
    let emailValidator = new EmailValidator();
    this.errors.email.hasErrors = true;
    if (!email) {
      this.errors.email.errorText = 'Enter your email address';
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
      this.errors.phoneNumber.errorText = 'Enter your telephone number';
    } else if (!phoneValidator.isValid(phone)) {
      this.errors.phoneNumber.errorText = 'You must enter a UK telephone number. For example, \'01632 960 001\', \'07700 900 982\' or \'+44 808 157 0192\'';
    } else {
      this.errors.phoneNumber.hasErrors = false;
    }
    return !this.errors.phoneNumber.hasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(this.nextRoute ?? ApAddressComponent.route, activatedRoute);
  }

  override canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentAccountablePerson.FirstName && !!this.applicationService.currentAccountablePerson.LastName;
  }
}
