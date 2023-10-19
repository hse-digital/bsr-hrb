import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, Status, User } from 'src/app/services/application.service';
import { UserListComponent } from '../change-applicant/user-list/user-list.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { RaDeclarationComponent } from '../ra-declaration/ra-declaration.component';

@Component({
  selector: 'hse-ra-check-answers',
  templateUrl: './ra-check-answers.component.html',
  styles: ['.govuk-summary-list__key { width:20%!important; }', '.govuk-summary-list__actions { width:10%!important; }', ]
})
export class RaCheckAnswersComponent extends PageComponent<void> {
  static route: string = 'check-answers';
  static title: string = "Changes you're making - Register a high-rise building - GOV.UK";

  primaryUser?: User;
  secondaryUser?: User;

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.primaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser;
    this.secondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> { }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(RaDeclarationComponent.route, this.activatedRoute);
  }

  changePrimaryUser() {
    this.navigationService.navigateRelative(UserListComponent.route, this.activatedRoute);
  }

  changeSecondaryUser() {
    this.navigationService.navigateRelative(UserListComponent.route, this.activatedRoute);
  }

  isThereNewPrimaryUser() {
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.PrimaryUser?.Status == Status.ChangesComplete
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser?.Email)
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser?.Firstname);
  }

  isThereNewSecondaryUser() {
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser?.Status == Status.ChangesComplete
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser?.Email)
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser?.Firstname);
  }

  isTherePreviousSecondaryUser() {
    return FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.SecondaryEmailAddress)
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.SecondaryFirstName);
  }

  secondaryUserRemoved() {
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser?.Status == Status.Removed;
  }

  get numberOfChanges() {
    let numChanges = this.isThereNewPrimaryUser() ? 1 : 0;
    numChanges += (this.isThereNewSecondaryUser() || this.secondaryUserRemoved()) ? 1 : 0;
    return numChanges;
  }

}
