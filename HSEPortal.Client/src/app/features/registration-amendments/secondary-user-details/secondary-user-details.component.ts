import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { PhoneNumberValidator } from 'src/app/helpers/validators/phone-number-validator';
import { User, ApplicationService, Status } from 'src/app/services/application.service';
import { EmailValidator } from 'src/app/helpers/validators/email-validator';
import { ConfirmSecondaryUserComponent } from '../confirm-secondary-user/confirm-secondary-user.component';

@Component({
  selector: 'hse-secondary-user-details',
  templateUrl: './secondary-user-details.component.html'
})
export class SecondaryUserDetailsComponent extends PageComponent<User> {
  static route: string = 'secondary-user-details';
  static title: string = "Tell us about the new secondary user - Register a high-rise building - GOV.UK";

  firstNameHasErrors: boolean = false;
  lastNameHasErrors: boolean = false;
  emailHasErrors: boolean = false;
  phoneNumberHasErrors: boolean = false;

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    let secondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;
    this.model = {
      Status: secondaryUser?.Status ?? Status.NoChanges,
      Email: secondaryUser?.Email,
      Firstname: secondaryUser?.Firstname,
      Lastname: secondaryUser?.Lastname,
      PhoneNumber: secondaryUser?.PhoneNumber
    }
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewSecondaryUser = {
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
    return this.navigationService.navigateRelative(ConfirmSecondaryUserComponent.route, this.activatedRoute);
  }

}
