import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
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
import { AddAccountablePersonComponent } from "../../add-accountable-person/add-accountable-person.component";

@Component({
  templateUrl: './lead-details.component.html'
})
export class LeadDetailsComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'lead-details';
  static title: string = "PAP organisation lead contact details - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  papName?: string;
  ngOnInit(): void {
    this.papName = `${this.applicationService.currentAccountablePerson.LeadFirstName} ${this.applicationService.currentAccountablePerson.LeadLastName}`;
    this.emailErrorText = `Enter ${this.papName}'s email address`;
    this.phoneErrorText = `Enter ${this.papName}'s telephone number`;
    this.jobRoleErrorText = `Select ${this.papName}'s job role`;
  }

  emailHasErrors: boolean = false;
  phoneHasErrors: boolean = false;
  jobRoleHasErrors: boolean = false;

  emailErrorText!: string;
  phoneErrorText!: string;
  jobRoleErrorText!: string;

  canContinue(): boolean {
    let email = this.applicationService.currentAccountablePerson.LeadEmail;
    let phone = this.applicationService.currentAccountablePerson.LeadPhoneNumber;
    let jobRole = this.applicationService.currentAccountablePerson.LeadJobRole;

    this.emailHasErrors = !this.isEmailValid(email);
    this.phoneHasErrors = !this.isPhoneNumberValid(phone);
    this.jobRoleHasErrors = !FieldValidations.IsNotNullOrWhitespace(jobRole);


    return !this.emailHasErrors && !this.phoneHasErrors && !this.jobRoleHasErrors;
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
    return navigationService.navigateRelative(`../${AddAccountablePersonComponent.route}`, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return ApHelper.isApAvailable(routeSnapshot, this.applicationService) 
      && ApHelper.isOrganisation(routeSnapshot, this.applicationService);
  }

} 
