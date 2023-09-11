import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage, Status, User } from 'src/app/services/application.service';

@Component({
  selector: 'hse-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent  extends PageComponent<string> {
  static route: string = 'user-list';
  static title: string = "Manage who can tell us about this building - Register a high-rise building - GOV.UK";

  ChangeUserStatuses = Status;
  primaryUser?: User;
  currentSecondaryUser?: User;
  newSecondaryUser?: User;

  constructor() {
    super();
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if(!this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser = {
        PrimaryUser: {
          Status: Status.NoChanges,
          Firstname: this.applicationService.model.ContactFirstName,
          Lastname: this.applicationService.model.ContactLastName,
          Email: this.applicationService.model.ContactEmailAddress
        }
      };
    }
    
    this.primaryUser = this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser.PrimaryUser;
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
    return true;
  }

  changePrimaryUser() {
    
  }

  changeSecondaryUser() {
    
  }

  removeSecondaryUser() {
    
  }

  isPrimary(flag: Status) {
    if (!this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.PrimaryUser) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.PrimaryUser!.Status = Status.NoChanges;
    }
    return (this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.PrimaryUser!.Status & flag) == flag;
  }

  isKbiSummitted() {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.KbiSubmitComplete) == BuildingApplicationStage.KbiSubmitComplete;
  }

  addSecondaryUser() {

  }

  currentSecondaryUserExists() {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser &&
      FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser.Firstname)
  }

  newSecondaryUserExists() {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser &&
      FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser.Firstname)
  }

}
