import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, Status } from 'src/app/services/application.service';
import { UserListComponent } from '../user-list/user-list.component';
import { ConfirmSecondaryUserComponent } from '../confirm-secondary-user/confirm-secondary-user.component';
import { SecondaryUserDetailsComponent } from '../secondary-user-details/secondary-user-details.component';

@Component({
  selector: 'hse-select-secondary-user',
  templateUrl: './select-secondary-user.component.html'
})
export class SelectSecondaryUserComponent  extends PageComponent<string> {
  static route: string = 'select-secondary-user';
  static title: string = "Select the new secondary user - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.model = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.WhoBecomeSecondary;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    let previousSelectionIsNotNewUser = this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.WhoBecomeSecondary != "new-user";
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.WhoBecomeSecondary = this.model;
    
    if(!!this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.SecondaryUser) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.SecondaryUser!.Status = Status.ChangesInProgress; 
    }
    

    switch(this.model) {
      case "named-contact": 
        this.setNamedContactAsSecondary(); break;
      case "new-user":
        if(previousSelectionIsNotNewUser) { this.clearNewSecondaryUser(); }
        break;
      case "no-secondary-user":
        this.removeNewSecondaryUser();
        
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    if(this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.WhoBecomeSecondary == "no-secondary-user") {
      return this.navigationService.navigateRelative(UserListComponent.route, this.activatedRoute);
    } else if (this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.WhoBecomeSecondary == "new-user") {
      return this.navigationService.navigateRelative(SecondaryUserDetailsComponent.route, this.activatedRoute);
    } else {
      return this.navigationService.navigateRelative(ConfirmSecondaryUserComponent.route, this.activatedRoute);
    }
  }

  namedContactExists() {
    let namedContactFirstName = this.applicationService.model.AccountablePersons[0].LeadFirstName;
    let namedContactLastName = this.applicationService.model.AccountablePersons[0].LeadLastName;
    let namedContactEmail = this.applicationService.model.AccountablePersons[0].LeadEmail;
    
    return FieldValidations.IsNotNullOrWhitespace(namedContactLastName) 
      && FieldValidations.IsNotNullOrWhitespace(namedContactFirstName)
      && FieldValidations.IsNotNullOrWhitespace(namedContactEmail);
  }

  isNamedContactAnExistingUser() {
    return this.areNamedContactAndPrimaryUserTheSame() ||  this.areNamedContactAndSecondaryUserTheSame();
  }

  areNamedContactAndPrimaryUserTheSame() {
    let namedContactEmail = this.applicationService.model.AccountablePersons[0].LeadEmail?.trim().toLowerCase();
    let namedContactFirstName = this.applicationService.model.AccountablePersons[0].LeadFirstName;

    let primaryUser = FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser?.Email)
      ? this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser
      : this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.PrimaryUser;

    let primaryUserEmail = primaryUser?.Email?.trim().toLowerCase();
    let primaryUserFirstName = primaryUser?.Firstname;

    return namedContactEmail == primaryUserEmail && namedContactFirstName == primaryUserFirstName;
  }

  areNamedContactAndSecondaryUserTheSame() {
    let namedContactEmail = this.applicationService.model.AccountablePersons[0].LeadEmail?.trim().toLowerCase();
    let namedContactFirstName = this.applicationService.model.AccountablePersons[0].LeadFirstName;

    let secondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser;

    let currentSecondaryUserEmail = secondaryUser?.Email?.trim().toLowerCase();
    let currentSecondaryUserFirstName = secondaryUser?.Firstname;
    
    return namedContactEmail == currentSecondaryUserEmail && namedContactFirstName == currentSecondaryUserFirstName;
  }
  
  get NamedContact() {
    return `${this.applicationService.model.AccountablePersons[0].LeadFirstName} ${this.applicationService.model.AccountablePersons[0].LeadLastName}`;
  }

  get NamedContactEmail() {
    return this.applicationService.model.AccountablePersons[0].LeadEmail;
  }
  
  setNamedContactAsSecondary() {
    let pap = this.applicationService.model.AccountablePersons[0];
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewSecondaryUser = {
      Status: Status.ChangesInProgress,
      Email: pap.LeadEmail,
      Firstname: pap.LeadFirstName,
      Lastname: pap.LeadLastName,
      PhoneNumber: pap.LeadPhoneNumber
    }
  }

  clearNewSecondaryUser() {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewSecondaryUser = {
      Status: Status.ChangesInProgress,
    }
  }

  removeNewSecondaryUser() {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewSecondaryUser = undefined;
  }
}
