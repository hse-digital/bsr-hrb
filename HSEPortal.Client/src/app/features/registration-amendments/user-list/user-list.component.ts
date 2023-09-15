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
export class UserListComponent  extends PageComponent<string> {
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
    
    this.newPrimaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser;
    this.newSecondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;
    this.currentSecondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser;

  }

  private initChangeUser() {
    if(!this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser = {
        PrimaryUser: {
          Status: Status.NoChanges
        }
      };
    }
  }

  private initPrimaryUser() {
    if (FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.PrimaryUser?.Email) 
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.PrimaryUser?.Firstname)) {
        this.primaryUser = this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.PrimaryUser;
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

  override async onSave(applicationService: ApplicationService): Promise<void> {
    
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
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

  currentSecondaryUserExists() {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser &&
      FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser.Firstname)
  }

  newSecondaryUserExists() {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser &&
      FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser.Firstname)
  }

  newPrimaryUserExists() {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser &&
      FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser.Firstname)
  }

}
