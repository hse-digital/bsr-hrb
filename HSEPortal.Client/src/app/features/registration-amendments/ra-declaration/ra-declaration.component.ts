import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, Status } from 'src/app/services/application.service';
import { RaConfirmationComponent } from '../ra-confirmation/ra-confirmation.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';

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
    return this.navigationService.navigateRelative(RaConfirmationComponent.route, this.activatedRoute);
  }

  userActingForPap() {
    let pap = this.applicationService.model.AccountablePersons[0];
    return pap.Type == 'organisation' && pap.Role == 'registering_for';
  }

  submitUserChanges() {
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.PrimaryUser!.Status = Status.ChangesSubmitted;
    
    let NewPrimaryUser = this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewPrimaryUser;
    if (!!NewPrimaryUser) {
      this.applicationService.model.NewPrimaryUserEmail = NewPrimaryUser?.Email;
    }

    let NewSecondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewSecondaryUser;
    if (!!NewSecondaryUser && FieldValidations.IsNotNullOrWhitespace(NewSecondaryUser.Email) && FieldValidations.IsNotNullOrWhitespace(NewSecondaryUser.Firstname)) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.SecondaryUser = {
        Status: Status.ChangesSubmitted,
        Email: NewSecondaryUser?.Email,
        Firstname: NewSecondaryUser?.Firstname,
        Lastname: NewSecondaryUser?.Lastname,
        PhoneNumber: NewSecondaryUser?.PhoneNumber
      }
  
      this.updateSecondaryUser();

      delete this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.NewSecondaryUser;
    }
  }

  private updateSecondaryUser() {
    let secondaryUser = this.applicationService.model.RegistrationAmendmentsModel!.ChangeUser!.SecondaryUser
    this.applicationService.model.SecondaryEmailAddress = secondaryUser?.Email;
    this.applicationService.model.SecondaryFirstName = secondaryUser?.Firstname;
    this.applicationService.model.SecondaryLastName = secondaryUser?.Lastname;
    this.applicationService.model.SecondaryPhoneNumber = secondaryUser?.PhoneNumber;
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
