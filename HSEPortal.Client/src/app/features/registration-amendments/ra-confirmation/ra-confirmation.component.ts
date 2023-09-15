import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, Status, User } from 'src/app/services/application.service';

@Component({
  selector: 'hse-ra-confirmation',
  templateUrl: './ra-confirmation.component.html'
})
export class RaConfirmationComponent  extends PageComponent<void> {
  static route: string = 'confirmation';
  static title: string = "Changes submitted - Register a high-rise building - GOV.UK";
  
  primaryUser?: User;
  secondaryUser?: User;

  submittionDate?: string;
  kbiSubmittionDate?: string;
  payment?: any;

  override async onInit(applicationService: ApplicationService): Promise<void> {
    
    this.submittionDate = await this.applicationService.getSubmissionDate();
    this.kbiSubmittionDate = await this.applicationService.getKbiSubmissionDate();

    var payments = await this.applicationService.getApplicationPayments()
    this.payment = payments.find(x => x.bsr_govukpaystatus == "success");

    this.primaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.PrimaryUser
    this.secondaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser

  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    
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

  newPrimaryUser() {
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.PrimaryUser?.Status == Status.ChangesSubmitted;
  }

  newSecondaryUser() {
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.CurrentSecondaryUser?.Status == Status.ChangesSubmitted
  }

}
