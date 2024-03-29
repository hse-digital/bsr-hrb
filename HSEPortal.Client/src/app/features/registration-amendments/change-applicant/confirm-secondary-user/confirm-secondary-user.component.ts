import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { User, ApplicationService, Status } from 'src/app/services/application.service';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'hse-confirm-secondary-user',
  templateUrl: './confirm-secondary-user.component.html'
})
export class ConfirmSecondaryUserComponent extends PageComponent<void> {
  static route: string = 'confirm-secondary-user';
  static title: string = "Confirm secondary user - Register a high-rise building - GOV.UK";

  secondaryUser?: User;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.secondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    if(!!this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewSecondaryUser) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewSecondaryUser.Status = Status.ChangesComplete; 
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    let secondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;
    let canAccess = FieldValidations.IsNotNullOrWhitespace(secondaryUser?.Firstname) 
      && FieldValidations.IsNotNullOrWhitespace(secondaryUser?.Lastname) 
      && FieldValidations.IsNotNullOrWhitespace(secondaryUser?.Email)
      && FieldValidations.IsNotNullOrWhitespace(secondaryUser?.PhoneNumber)
      && secondaryUser?.Status == Status.ChangesInProgress;
    return canAccess && !this.applicationService.model.IsSecondary; 
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(UserListComponent.route, this.activatedRoute);
  }

  hasSecondaryUserChanged() {
    let secondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser;
    return FieldValidations.IsNotNullOrWhitespace(secondaryUser?.Email) 
      && FieldValidations.IsNotNullOrWhitespace(secondaryUser?.Firstname);
  }

}
