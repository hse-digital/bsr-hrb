import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, Status } from 'src/app/services/application.service';

@Component({
  selector: 'hse-ra-declaration',
  templateUrl: './ra-declaration.component.html'
})
export class RaDeclarationComponent extends PageComponent<void> {
  static route: string = 'declaration';
  static title: string = "Declaration about changes - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {

  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    this.submitUserChanges();
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return true;
  }

  userActingForPap() {
    let pap = this.applicationService.model.AccountablePersons[0];
    return pap.Type == 'organisation' && pap.Role == 'registering_for';
  }

  submitUserChanges() {
    let NewPrimaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser;
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.PrimaryUser = {
      Status: Status.ChangesComplete,
      Email: NewPrimaryUser?.Email,
      Firstname: NewPrimaryUser?.Firstname,
      Lastname: NewPrimaryUser?.Lastname,
      PhoneNumber: NewPrimaryUser?.PhoneNumber
    }

    let NewSecondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.CurrentSecondaryUser = {
      Status: Status.ChangesComplete,
      Email: NewSecondaryUser?.Email,
      Firstname: NewSecondaryUser?.Firstname,
      Lastname: NewSecondaryUser?.Lastname,
      PhoneNumber: NewSecondaryUser?.PhoneNumber
    }

    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewPrimaryUser = undefined;
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewSecondaryUser = undefined;
  }

  get onlyRegistrationInformation() {
    return false;
  }

  get areasAccountability() {
    return false;
  }

  get deregistering() {
    return false;
  }

}
