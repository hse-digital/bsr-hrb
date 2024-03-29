import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { BroadcastChannelPrimaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage, BuildingApplicationStatuscode, Status, User } from 'src/app/services/application.service';

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
  openPayment?: any;
  newChanges: boolean = false;
  newChangesWithdrawal: boolean = false;
  appIsRegistered: boolean = false;

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.appIsRegistered = await this.getApplicationIsRegistered();
    
    this.activatedRoute.queryParams.subscribe(async params => {
      this.newChanges = params['newChanges'] == "true";
      this.newChangesWithdrawal = 
        this.newChanges && this.applicationService.model.RegistrationAmendmentsModel?.Deregister?.AreYouSure == 'yes';
    });

    this.sendApplicationDataToBroadcastChannel();

    this.submittionDate = await this.applicationService.getSubmissionDate();
    this.kbiSubmittionDate = await this.applicationService.getKbiSubmissionDate();

    var payments = await this.applicationService.getApplicationPayments()
    this.payment = payments.find(x => x.bsr_govukpaystatus == "success");
    this.openPayment = payments.find(x => x.bsr_govukpaystatus == "open");

    this.primaryUser = this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.NewPrimaryUser
    this.secondaryUser = {
      Status: Status.ChangesSubmitted,
      Email: this.applicationService.model.SecondaryEmailAddress,
      Firstname: this.applicationService.model.SecondaryFirstName,
      Lastname: this.applicationService.model.SecondaryLastName,
      PhoneNumber: this.applicationService.model.SecondaryPhoneNumber
    }
  }

  private async getApplicationIsRegistered(): Promise<boolean> {
      const applicationStatuscode = await this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!);
      return applicationStatuscode == BuildingApplicationStatuscode.Registered 
        || applicationStatuscode == BuildingApplicationStatuscode.RegisteredKbiValidated;
  }

  private sendApplicationDataToBroadcastChannel() {
    new BroadcastChannelPrimaryHelper()
      .OpenChannel(this.applicationService.model.id!)
      .SendDataWhenSecondaryJoinChannel(this.applicationService.model);
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
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.PrimaryUser?.Status == Status.ChangesSubmitted &&
      FieldValidations.IsNotNullOrWhitespace(this.primaryUser?.Email) && FieldValidations.IsNotNullOrWhitespace(this.primaryUser?.Firstname);
  }

  newSecondaryUser() {
    return this.applicationService.model.RegistrationAmendmentsModel?.ChangeUser?.SecondaryUser?.Status == Status.ChangesSubmitted;
  }

  buildingSummaryApKbiConnectionChanges() {
    return this.newChanges;
  }

  isKbiSubmitted() {
    return this.containsFlag(this.applicationService.model.ApplicationStatus, BuildingApplicationStage.KbiSubmitComplete);
  }

  containsFlag(currentApplicationStage: BuildingApplicationStage, flag: BuildingApplicationStage) {
    return (currentApplicationStage & flag) == flag;
  }

  isSubmittionBefore3Sep2023() {
    let threeSep2023 = new Date("09/03/2023");
    if (FieldValidations.IsNotNullOrWhitespace(this.submittionDate)) {
      let submittionDate = new Date(this.submittionDate!);
      return submittionDate < threeSep2023;
    }
    return false;
  }

  get28DaysAfterSubmittionDate() {
    if (FieldValidations.IsNotNullOrWhitespace(this.submittionDate)) {
      let submittionDate = new Date(this.submittionDate!);
      return submittionDate.setDate(submittionDate.getDate() + 28);
    }
    return undefined;
  }

  get registrationApplicationDate() {
    let invoiceCreationDate = this.openPayment?.bsr_invoicecreationdate ?? "";
    return FieldValidations.IsNotNullOrWhitespace(this.submittionDate) ? this.submittionDate : invoiceCreationDate;
  }

}
