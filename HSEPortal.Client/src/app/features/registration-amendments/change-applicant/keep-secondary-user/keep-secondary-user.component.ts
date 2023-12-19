import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { User, ApplicationService, Status } from 'src/app/services/application.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'hse-keep-secondary-user',
  templateUrl: './keep-secondary-user.component.html'
})
export class KeepSecondaryUserComponent extends PageComponent<string> {
  static route: string = 'keep-secondary-user';
  static title: string = "Confirm you want to keep this secondary user - Register a high-rise building - GOV.UK";

  secondaryUser?: User;

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.secondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser;
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    if(this.model == 'no') {
          
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.SecondaryUser!.Status = Status.Removed;
  
      delete this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewSecondaryUser;
  
      delete this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.WhoBecomeSecondary;
      
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.PrimaryUser!.Status == Status.ChangesComplete  
      && !this.applicationService.model.IsSecondary;
  }

  override isValid(): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.model);
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(UserListComponent.route, this.activatedRoute);
  }

  get errorMessage() {
    return `Select yes if you want to keep ${this.secondaryUser?.Firstname} ${this.secondaryUser?.Lastname} as the secondary user`;
  }

}
