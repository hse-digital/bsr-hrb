import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';

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
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.WhoBecomeSecondary = this.model;
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

  get NamedContact() {
    return `${this.applicationService.model.AccountablePersons[0].LeadFirstName} ${this.applicationService.model.AccountablePersons[0].LeadLastName}`;
  }

  get NamedContactEmail() {
    return this.applicationService.model.AccountablePersons[0].LeadEmail;
  }

}
