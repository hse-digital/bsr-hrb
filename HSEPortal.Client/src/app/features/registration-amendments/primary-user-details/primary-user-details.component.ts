import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { EmailValidator } from 'src/app/helpers/validators/email-validator';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { PhoneNumberValidator } from 'src/app/helpers/validators/phone-number-validator';
import { ApplicationService, Status, User } from 'src/app/services/application.service';
import { ConfirmPrimaryUserComponent } from '../confirm-primary-user/confirm-primary-user.component';

@Component({
  selector: 'hse-primary-user-details',
  templateUrl: './primary-user-details.component.html'
})
export class PrimaryUserDetailsComponent  extends PageComponent<User> {
  static route: string = 'primary-user-details';
  static title: string = "Tell us about the new primary user - Register a high-rise building - GOV.UK";

  firstNameHasErrors: boolean = false;
  lastNameHasErrors: boolean = false;
  emailHasErrors: boolean = false;
  phoneNumberHasErrors: boolean = false;

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    let primaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser;
    this.model = {
      Status: primaryUser?.Status ?? Status.NoChanges,
      Email: primaryUser?.Email,
      Firstname: primaryUser?.Firstname,
      Lastname: primaryUser?.Lastname,
      PhoneNumber: primaryUser?.PhoneNumber
    }
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewPrimaryUser = {
      Status: Status.ChangesInProgress,
      Email: this.model?.Email,
      Firstname: this.model?.Firstname,
      Lastname: this.model?.Lastname,
      PhoneNumber: this.model?.PhoneNumber
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    this.firstNameHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.model?.Firstname) 
    this.lastNameHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.model?.Lastname)
    this.emailHasErrors = !(FieldValidations.IsNotNullOrWhitespace(this.model?.Email) && EmailValidator.isValid(this.model!.Email!))
    this.phoneNumberHasErrors = !(FieldValidations.IsNotNullOrWhitespace(this.model?.PhoneNumber) && PhoneNumberValidator.isValid(this.model!.PhoneNumber!));
    return !this.firstNameHasErrors && !this.lastNameHasErrors && !this.emailHasErrors && !this.phoneNumberHasErrors;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(ConfirmPrimaryUserComponent.route, this.activatedRoute);
  }
}
