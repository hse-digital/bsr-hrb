import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { User, ApplicationService, Status } from 'src/app/services/application.service';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'hse-remove-secondary-user',
  templateUrl: './remove-secondary-user.component.html'
})
export class RemoveSecondaryUserComponent extends PageComponent<void> {
  static route: string = 'remove-secondary-user';
  static title: string = "Confirm you want to remove this user - Register a high-rise building - GOV.UK";

  secondaryUser?: User;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.secondaryUser = FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser?.Email)
      ? this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser
      : this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser;

  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.SecondaryUser = {
      Status: Status.NoChanges
    }
    
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewSecondaryUser = {
      Status: Status.NoChanges
    }

    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.WhoBecomeSecondary = undefined;
    
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true; 
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(UserListComponent.route, this.activatedRoute);
  }

}
