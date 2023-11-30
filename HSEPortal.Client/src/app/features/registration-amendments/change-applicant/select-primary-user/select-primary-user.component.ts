import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage } from 'src/app/services/application.service';
import { Status } from 'src/app/services/application.service';
import { PrimaryUserDetailsComponent } from '../primary-user-details/primary-user-details.component';
import { ConfirmPrimaryUserComponent } from '../confirm-primary-user/confirm-primary-user.component';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'hse-select-primary-user',
  templateUrl: './select-primary-user.component.html'
})
export class SelectPrimaryUserComponent extends PageComponent<string> {
  static route: string = 'select-primary-user';
  static title: string = "Select the new primary user - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.model = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.WhoBecomePrimary;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    let previousSelectionIsNotNewUser = this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.WhoBecomePrimary != "new-user";
    let previousSelection = this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.WhoBecomePrimary;
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.WhoBecomePrimary = this.model;

    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.PrimaryUser!.Status = Status.ChangesInProgress;

    switch (this.model) {
      case "named-contact":
        this.setNamedContactAsPrimary(); break;
      case "secondary-user":
        this.setSecondaryUserAsPrimary(); break;
      case "new-named-contact":
        this.setNewNamedContactAsPrimary(); break;
      case "keep-me":
        this.setApplicantAsPrimary(previousSelection);
        break;
      case "new-user":
        if (previousSelectionIsNotNewUser) { this.clearNewPrimaryUser(); }
        break;
    }

  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return ((this.applicationService.model.ApplicationStatus & BuildingApplicationStage.AccountablePersonsComplete) == BuildingApplicationStage.AccountablePersonsComplete)
      && !this.applicationService.model.IsSecondary;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    if (this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.WhoBecomePrimary == "new-user") {
      return this.navigationService.navigateRelative(PrimaryUserDetailsComponent.route, this.activatedRoute);
    } else if (this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.WhoBecomePrimary == "keep-me") {
      return this.navigationService.navigateRelative(UserListComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(ConfirmPrimaryUserComponent.route, this.activatedRoute);
  }

  isNamedContactAnExistingUser() {
    return this.areNamedContactAndPrimaryUserTheSame() || this.areNamedContactAndSecondaryUserTheSame();
  }

  areNamedContactAndPrimaryUserTheSame() {
    let namedContactEmail = this.applicationService.currentVersion.AccountablePersons[0].LeadEmail?.trim().toLowerCase();
    let namedContactFirstName = this.applicationService.currentVersion.AccountablePersons[0].LeadFirstName;

    let primaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.PrimaryUser;

    let primaryUserEmail = primaryUser?.Email?.trim().toLowerCase();
    let primaryUserFirstName = primaryUser?.Firstname;

    return namedContactEmail == primaryUserEmail && namedContactFirstName == primaryUserFirstName;
  }

  areNamedContactAndSecondaryUserTheSame() {
    let namedContactEmail = this.applicationService.currentVersion.AccountablePersons[0].LeadEmail?.trim().toLowerCase();
    let namedContactFirstName = this.applicationService.currentVersion.AccountablePersons[0].LeadFirstName;

    let secondaryUser = FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser?.Email)
      ? this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser
      : this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser;

    let currentSecondaryUserEmail = secondaryUser?.Email?.trim().toLowerCase();
    let currentSecondaryUserFirstName = secondaryUser?.Firstname;

    return namedContactEmail == currentSecondaryUserEmail && namedContactFirstName == currentSecondaryUserFirstName;
  }

  secondaryUserExist() {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser &&
      FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser.Email)
      && this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser.Status != Status.Removed;
  }

  newNamedContact() {
    let pap = this.applicationService.currentVersion.AccountablePersons[0];
    return this.applicationService.model.RegistrationAmendmentsModel?.AccountablePersonStatus?.Status != Status.NoChanges
      && this.NewNamedContact
      && FieldValidations.IsNotNullOrWhitespace(pap.NamedContactFirstName)
      && FieldValidations.IsNotNullOrWhitespace(pap.NamedContactLastName);
  }

  get NamedContact() {
    return `${this.applicationService.currentVersion.AccountablePersons[0].LeadFirstName} ${this.applicationService.currentVersion.AccountablePersons[0].LeadLastName}`;
  }

  get NamedContactEmail() {
    return this.applicationService.currentVersion.AccountablePersons[0].LeadEmail;
  }

  get NewNamedContact() {
    let pap = this.applicationService.currentVersion.AccountablePersons[0];
    return `${this.applicationService.currentVersion.AccountablePersons[0].NamedContactFirstName} ${pap.NamedContactLastName}`;
  }

  get NewNamedContactEmail() {
    return this.applicationService.currentVersion.AccountablePersons[0]?.NamedContactEmail;
  }

  get SecondaryUserName() {
    return `${this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser?.Firstname} ${this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser?.Lastname}`;
  }

  get SecondaryUserEmail() {
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser?.Email;
  }

  setNamedContactAsPrimary() {
    let pap = this.applicationService.currentVersion.AccountablePersons[0];
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewPrimaryUser = {
      Status: Status.ChangesInProgress,
      Email: pap.LeadEmail,
      Firstname: pap.LeadFirstName,
      Lastname: pap.LeadLastName,
      PhoneNumber: pap.LeadPhoneNumber
    }
  }

  setNewNamedContactAsPrimary() {
    let apChanges = this.applicationService.currentVersion.AccountablePersons[0];
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewPrimaryUser = {
      Status: Status.ChangesInProgress,
      Email: apChanges?.NamedContactEmail,
      Firstname: apChanges?.NamedContactFirstName,
      Lastname: apChanges?.NamedContactLastName,
      PhoneNumber: apChanges?.NamedContactPhoneNumber
    }
  }

  setSecondaryUserAsPrimary() {
    let secondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser;
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewPrimaryUser = {
      Status: Status.ChangesInProgress,
      Email: secondaryUser?.Email,
      Firstname: secondaryUser?.Firstname,
      Lastname: secondaryUser?.Lastname,
      PhoneNumber: secondaryUser?.PhoneNumber
    }
  }

  setApplicantAsPrimary(previousSelection?: string) {
    let secondaryUser = this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.SecondaryUser;
    if (previousSelection?.trim() == "secondary-user" && !!secondaryUser && FieldValidations.IsNotNullOrWhitespace(secondaryUser?.Email) && secondaryUser.Status == Status.Removed) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.SecondaryUser!.Status = Status.NoChanges;
    }
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.PrimaryUser!.Status = Status.NoChanges;
    delete this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewPrimaryUser;
  }

  clearNewPrimaryUser() {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewPrimaryUser = {
      Status: Status.ChangesInProgress,
    }
  }

}
