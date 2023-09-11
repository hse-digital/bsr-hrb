import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { Status } from 'src/app/services/application.service';

@Component({
  selector: 'hse-select-primary-user',
  templateUrl: './select-primary-user.component.html'
})
export class SelectPrimaryUserComponent extends PageComponent<string> {
  static route: string = 'select-primary-user';
  static title: string = "Select the new primary user - Register a high-rise building - GOV.UK";

  constructor() {
    super();
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.model = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.WhoBecomePrimary;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.WhoBecomePrimary = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    return true;
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

  secondaryUserExist() {
    return !!this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser &&
      FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser.Email);
  }

  newNamedContact() {
    return this.applicationService.model.RegistrationAmendmentsModel?.AccountablePersonStatus?.Status != Status.NoChanges &&
      this.applicationService.model.RegistrationAmendmentsModel?.AccountablePersonStatus?.NewNamedContact
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.AccountablePersonStatus?.NewNamedContactFirstName) 
      && FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.AccountablePersonStatus?.NewNamedContactLastName); 
  }

  get NamedContact() {
    return `${this.applicationService.model.AccountablePersons[0].LeadFirstName} ${this.applicationService.model.AccountablePersons[0].LeadLastName}`;
  }

  get NamedContactEmail() {
    return this.applicationService.model.AccountablePersons[0].LeadEmail;
  }

  get NewNamedContact() {
    return `${this.applicationService.model.RegistrationAmendmentsModel?.AccountablePersonStatus?.NewNamedContactFirstName} ${this.applicationService.model.RegistrationAmendmentsModel?.AccountablePersonStatus?.NewNamedContactLastName}`;
  }

  get NewNamedContactEmail() {
    return this.applicationService.model.RegistrationAmendmentsModel?.AccountablePersonStatus?.NewNamedContactEmail;
  }

  get SecondaryUserName() {
    return `${this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser?.Firstname} ${this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser?.Lastname}`;
  }

  get SecondaryUserEmail() {
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser?.Email;
  }

}
