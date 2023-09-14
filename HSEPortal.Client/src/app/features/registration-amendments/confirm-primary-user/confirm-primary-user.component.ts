import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, Status, User } from 'src/app/services/application.service';

@Component({
  selector: 'hse-confirm-primary-user',
  templateUrl: './confirm-primary-user.component.html'
})
export class ConfirmPrimaryUserComponent  extends PageComponent<void> {
  static route: string = 'confirm-primary-user';
  static title: string = "Confirm new primary user - Register a high-rise building - GOV.UK";

  primaryUser?: User;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.primaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser;
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {

    if(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.WhoBecomePrimary == "secondary-user") {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.CurrentSecondaryUser = {
        Status: Status.NoChanges
      }
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    let primaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser;
    let canAccess = FieldValidations.IsNotNullOrWhitespace(primaryUser?.Firstname) 
      && FieldValidations.IsNotNullOrWhitespace(primaryUser?.Lastname) 
      && FieldValidations.IsNotNullOrWhitespace(primaryUser?.Email) 
      && FieldValidations.IsNotNullOrWhitespace(primaryUser?.PhoneNumber)
      && primaryUser?.Status == Status.ChangesInProgress;
    return canAccess; 
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return true;
  }

}
