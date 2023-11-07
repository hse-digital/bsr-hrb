import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, SectionModel, Status, User } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { RegistrationAmendmentsService } from 'src/app/services/registration-amendments.service';
import { UserListComponent } from '../change-applicant/user-list/user-list.component';


@Component({
  selector: 'ra-check-answers-users',
  templateUrl: './ra-check-answers-users.component.html'
})
export class RaCheckAnswersUsersComponent implements OnInit {
  
  primaryUser?: User;
  secondaryUser?: User;
  UsersHelper: RaCheckAnswersUsersHelper;
  
  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute, protected applicationService: ApplicationService, private registrationAmendmentsService: RegistrationAmendmentsService) { 
    this.UsersHelper = new RaCheckAnswersUsersHelper(this.applicationService);
  }

  ngOnInit(): void {
    this.primaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser;
    this.secondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;
  }
  
  get numberOfChanges() {
    return this.UsersHelper.numberOfUserChanges;
  }

  changePrimaryUser() {
    this.navigationService.navigateRelative(UserListComponent.route, this.activatedRoute);
  }

  changeSecondaryUser() {
    this.navigationService.navigateRelative(UserListComponent.route, this.activatedRoute);
  }

  
}

export class RaCheckAnswersUsersHelper {

  constructor(private applicationService: ApplicationService) {

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

  get numberOfUserChanges() {
    let numChanges = this.isThereNewPrimaryUser() ? 1 : 0;
    numChanges += (this.isThereNewSecondaryUser() || this.secondaryUserRemoved()) ? 1 : 0;
    return numChanges;
  }
}