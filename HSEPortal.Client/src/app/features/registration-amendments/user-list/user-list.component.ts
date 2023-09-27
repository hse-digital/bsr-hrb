import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage, Status, User } from 'src/app/services/application.service';
import { SelectPrimaryUserComponent } from '../select-primary-user/select-primary-user.component';
import { SelectSecondaryUserComponent } from '../select-secondary-user/select-secondary-user.component';
import { RemoveSecondaryUserComponent } from '../remove-secondary-user/remove-secondary-user.component';
import { ChangeTaskListComponent } from '../change-task-list/change-task-list.component';

@Component({
  selector: 'hse-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent extends PageComponent<string> {
  static route: string = 'user-list';
  static title: string = "Manage who can tell us about this building - Register a high-rise building - GOV.UK";

  ChangeUserStatuses = Status;

  primaryUser?: User;
  newPrimaryUser?: User;

  currentSecondaryUser?: User;
  newSecondaryUser?: User;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.initChangeUser();
    this.initPrimaryUser();
    this.initSecondaryUser();

    this.newPrimaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser;
    this.newSecondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;

  }

  private initChangeUser() {
    if (!this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser = {
        PrimaryUser: {
          Status: Status.NoChanges
        }
      };
    }
  }

  private initPrimaryUser() {

    let primaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.PrimaryUser;
    let newPrimaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser;

    if (this.newPrimaryUserExists()) {
      this.primaryUser = {
        Status: primaryUser?.Status ?? Status.ChangesInProgress,
        Firstname: newPrimaryUser?.Firstname,
        Lastname: newPrimaryUser?.Lastname,
        Email: newPrimaryUser?.Email,
        PhoneNumber: newPrimaryUser?.PhoneNumber
      }
    } else {
      this.primaryUser = {
        Status: Status.NoChanges,
        Firstname: this.applicationService.model.ContactFirstName,
        Lastname: this.applicationService.model.ContactLastName,
        Email: this.applicationService.model.ContactEmailAddress,
        PhoneNumber: this.applicationService.model.ContactPhoneNumber
      }
    }
  }

  private initSecondaryUser() {
    if (FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser?.Email)
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser?.Firstname)) {
      let status = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser?.Status;
      if (status != Status.Removed) {
        this.currentSecondaryUser = this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.SecondaryUser;
      }
    } else {
      this.currentSecondaryUser = {
        Status: Status.NoChanges,
        Firstname: this.applicationService.model.SecondaryFirstName,
        Lastname: this.applicationService.model.SecondaryLastName,
        Email: this.applicationService.model.SecondaryEmailAddress,
        PhoneNumber: this.applicationService.model.SecondaryPhoneNumber
      }

      this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.SecondaryUser = {
        Status: Status.NoChanges,
        Firstname: this.applicationService.model.SecondaryFirstName,
        Lastname: this.applicationService.model.SecondaryLastName,
        Email: this.applicationService.model.SecondaryEmailAddress,
        PhoneNumber: this.applicationService.model.SecondaryPhoneNumber
      }
    }
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {

  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.AccountablePersonsComplete) == BuildingApplicationStage.AccountablePersonsComplete;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(ChangeTaskListComponent.route, this.activatedRoute);
  }

  changePrimaryUser() {
    this.navigationService.navigateRelative(SelectPrimaryUserComponent.route, this.activatedRoute);
  }

  changeSecondaryUser() {
    this.navigationService.navigateRelative(SelectSecondaryUserComponent.route, this.activatedRoute);
  }

  removeSecondaryUser() {
    this.navigationService.navigateRelative(RemoveSecondaryUserComponent.route, this.activatedRoute);
  }

  isNewPrimary(flag: Status) {
    if (!this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewPrimaryUser = { Status: Status.NoChanges }
    }
    return (this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewPrimaryUser!.Status & flag) == flag;
  }

  isKbiSummitted() {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.KbiSubmitComplete) == BuildingApplicationStage.KbiSubmitComplete;
  }

  addSecondaryUser() {
    this.navigationService.navigateRelative(SelectSecondaryUserComponent.route, this.activatedRoute);
  }

  isSecondaryUserRemoved() {
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser?.Status == Status.Removed;
  }

  currentSecondaryUserExists() {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser &&
      FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser.Firstname);
  }

  newSecondaryUserExists() {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser &&
      FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser.Firstname);
  }

  newPrimaryUserExists() {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser &&
      FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser.Firstname)
  }

}
