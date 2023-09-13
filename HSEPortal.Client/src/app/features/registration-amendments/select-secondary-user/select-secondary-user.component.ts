import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, Status } from 'src/app/services/application.service';
import { UserListComponent } from '../user-list/user-list.component';

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
        
    switch(this.model) {
      case "named-contact": 
        this.setNamedContactAsPrimary(); break;
      case "new-user":
        if(previousSelectionIsNotNewUser) { this.clearNewSecondaryUser(); }
        break;
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
      return true; // navigate to details screen
    } else {
      return true; // navigate to confirm screen
    }
  }

  isNamedContactAnExistingUser() {
    return this.areNamedContactAndPrimaryUserTheSame() ||  this.areNamedContactAndSecondaryUserTheSame();
  }

  areNamedContactAndPrimaryUserTheSame() {
    let namedContactEmail = this.applicationService.model.AccountablePersons[0].LeadEmail?.trim().toLowerCase();
    let primaryUserEmail = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.PrimaryUser?.Email;
    return namedContactEmail == primaryUserEmail;
  }

  areNamedContactAndSecondaryUserTheSame() {
    let namedContactEmail = this.applicationService.model.AccountablePersons[0].LeadEmail?.trim().toLowerCase();
    let currentSecondaryUserEmail = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser?.Email;
    return namedContactEmail == currentSecondaryUserEmail;
  }

  get NamedContact() {
    return `${this.applicationService.model.AccountablePersons[0].LeadFirstName} ${this.applicationService.model.AccountablePersons[0].LeadLastName}`;
  }

  get NamedContactEmail() {
    return this.applicationService.model.AccountablePersons[0].LeadEmail;
  }
  
  setNamedContactAsPrimary() {
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
}
