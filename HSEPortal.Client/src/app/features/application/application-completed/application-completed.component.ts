import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BroadcastChannelPrimaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage, BuildingApplicationStatuscode, RegistrationAmendmentsModel, Status } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-application-completed',
  templateUrl: './application-completed.component.html'
})
export class ApplicationCompletedComponent implements OnInit, CanActivate {

  static route: string = 'application-completed';
  static title: string = "Application history - Register a high-rise building - GOV.UK";
  
  shouldRender: boolean = false;
  submittionDate?: string;
  kbiSubmittionDate?: string;
  payment?: any;
  openPayment?: any;
  applicationStatuscode: BuildingApplicationStatuscode = BuildingApplicationStatuscode.New;

  constructor(public applicationService: ApplicationService, private navigationService: NavigationService) {

  }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.AccountablePersonsComplete) == BuildingApplicationStage.AccountablePersonsComplete;
  }

  async ngOnInit(): Promise<void> {
    this.shouldRender = false;

    this.sendApplicationDataToBroadcastChannel();

    this.submittionDate = await this.applicationService.getSubmissionDate();

    this.kbiSubmittionDate = await this.applicationService.getKbiSubmissionDate();

    this.applicationStatuscode = await this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!);

    var payments = await this.applicationService.getApplicationPayments();
    if(payments != undefined) {
      this.initPayment(payments);
      this.shouldRender = true;
    } else {
      this.getPaymentInformation().then((result: any) => {
        payments = result;
        this.initPayment(payments);
        this.shouldRender = true;
      });
    }
  }

  private initPayment(payments: any) {
    this.payment = payments.find((x: { bsr_govukpaystatus: string; }) => x.bsr_govukpaystatus == "success");
    this.openPayment = payments.find((x: { bsr_govukpaystatus: string; }) => x.bsr_govukpaystatus == "open");
  }

  private async getPaymentInformation() {
    return await new Promise(resolve => {
      const interval = setInterval(() => {
        this.applicationService.getApplicationPayments().then((result) => {
          if (result != undefined && result.length > 0) {
            resolve(result);
            clearInterval(interval);
          };
        });
      }, 5000);
    });
  }


  private sendApplicationDataToBroadcastChannel() {
    new BroadcastChannelPrimaryHelper()
      .OpenChannel(this.applicationService.model.id!)
      .SendDataWhenSecondaryJoinChannel(this.applicationService.model);
  }

  async newApplication() {
    await this.navigationService.navigate('/select');
  }

  private sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }

  isViewOne(): boolean {
    return ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isAppStatusInProgressOrSubmitted(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndInvoicePaid(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.payment?.bsr_govukpaystatus) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.RegistrationAmendmentsModel);
  }

  isViewOneA(): boolean {
    return ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isAppStatusInProgressOrSubmitted(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndRaisedAnInvoice(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.applicationService.model.PaymentInvoiceDetails?.Status) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.RegistrationAmendmentsModel);
  }

  isViewTwo() {
    return ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isNotNewInProgressSubmittedRegisteredWithdrawnRejected(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndPaid(this.applicationService.model.ApplicationStatus) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.RegistrationAmendmentsModel);
  }

  isViewThree() {
    return ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isRegistered(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndPaid(this.applicationService.model.ApplicationStatus) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.RegistrationAmendmentsModel);
  }

  isViewFour() {
    return !ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isAppStatusInProgressOrSubmitted(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndInvoicePaid(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.payment?.bsr_govukpaystatus) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.RegistrationAmendmentsModel);
  }

  isViewFourA() {
    return !ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isAppStatusInProgressOrSubmitted(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndRaisedAnInvoice(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.applicationService.model.PaymentInvoiceDetails?.Status) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.RegistrationAmendmentsModel);
  }

  isViewFive() {
    return !ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isNotNewInProgressSubmittedRegisteredWithdrawnRejected(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndPaid(this.applicationService.model.ApplicationStatus) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.RegistrationAmendmentsModel);
  }

  isViewSix() {
    return !ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isRegistered(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndPaid(this.applicationService.model.ApplicationStatus) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.RegistrationAmendmentsModel);
  }

  isViewSeven() {
    return ApplicationStageHelper.isApplicationSubmittedOrRaisedAnInvoice(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.applicationService.model.PaymentInvoiceDetails?.Status) &&
    ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.RegistrationAmendmentsModel) &&
    !StatuscodeHelper.isRejected(this.applicationStatuscode);
  }

  isViewThirteen() {
    return StatuscodeHelper.isRejected(this.applicationStatuscode);
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

  get title(): string {
    let buildingName = this.applicationService.model.BuildingName;
    if(this.isViewOne()) {
      return `Registration application for ${buildingName} has been submitted`;
    } else if (this.isViewOneA()) {
      return `Registration application for ${buildingName} is awaiting payment`;
    } else if (this.isViewTwo()) {
      return `Registration application for ${buildingName} is being processed`;
    } else if (this.isViewThree()) {
      return `Registration application for ${buildingName} has been accepted`;
    } else if (this.isViewFour()) {
      return `Registration application for ${buildingName} has been submitted`;
    } else if (this.isViewFourA()) {
      return `Registration application for ${buildingName} is awaiting payment`;
    }  else if (this.isViewFive()) {
      return `Registration application for ${buildingName} is being processed`;
    } else if (this.isViewSix()) {
      return `Registration application for ${buildingName} has been accepted`;
    } else if (this.isViewSeven()) {
      return `Changes to ${buildingName} submitted`;
    } else if (this.isViewThirteen()) {
      return `Registration application for ${buildingName} has been rejected`;
    }
    return "";
  }

  get isKbiSubmitted() {
    return ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus)
  }

  get registrationApplicationDate() {
    let invoiceCreationDate = this.openPayment?.bsr_invoicecreationdate ?? "";
    return FieldValidations.IsNotNullOrWhitespace(this.submittionDate) ? this.submittionDate : invoiceCreationDate;
  }

}

class StatuscodeHelper {
  static isAppStatusInProgressOrSubmitted(statuscode: BuildingApplicationStatuscode) {
    return statuscode == BuildingApplicationStatuscode.SubmittedAwaitingAllocation ||
      statuscode == BuildingApplicationStatuscode.InProgress;
  }

  static isNotNewInProgressSubmittedRegisteredWithdrawnRejected(statuscode: BuildingApplicationStatuscode) {
    return statuscode != BuildingApplicationStatuscode.New &&
      statuscode != BuildingApplicationStatuscode.InProgress &&
      statuscode != BuildingApplicationStatuscode.SubmittedAwaitingAllocation &&
      statuscode != BuildingApplicationStatuscode.Registered &&
      statuscode != BuildingApplicationStatuscode.Withdrawn &&
      statuscode != BuildingApplicationStatuscode.Rejected;
  }

  static isRegistered(statuscode: BuildingApplicationStatuscode) {
    return statuscode == BuildingApplicationStatuscode.Registered;
  }

  static isRejected(statuscode: BuildingApplicationStatuscode) {
    return statuscode == BuildingApplicationStatuscode.Rejected;
  }
}

class ApplicationStageHelper {
  static isApplicationSubmittedOrRaisedAnInvoice(currentApplicationStage: BuildingApplicationStage, paymentType?: string, paymentInvoiceStatus?: string) {
    let isAppSubmitted = ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.AccountablePersonsComplete) &&
      ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.PaymentInProgress);

    let raisedAnInvoice = paymentType == 'invoice' && paymentInvoiceStatus == 'awaiting';
    return isAppSubmitted || raisedAnInvoice;
  }

  static isApplicationSubmittedAndRaisedAnInvoice(currentApplicationStage: BuildingApplicationStage, paymentType?: string, paymentInvoiceStatus?: string) {
    let isAppSubmitted = ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.AccountablePersonsComplete) &&
      ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.PaymentInProgress);
    let raisedAnInvoice = paymentType == 'invoice' && paymentInvoiceStatus == 'awaiting';
    return isAppSubmitted && raisedAnInvoice;
  }

  static isApplicationSubmittedAndInvoicePaid(currentApplicationStage: BuildingApplicationStage, paymentType?: string, paymentStatus?: string) {
    let isAppSubmitted = ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.AccountablePersonsComplete);

    return isAppSubmitted && paymentStatus == 'success';
  }

  static isApplicationSubmittedAndPaid(currentApplicationStage: BuildingApplicationStage) {
    return ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.AccountablePersonsComplete) &&
      ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.PaymentComplete);
  }

  static isOnlySubmitted(currentApplicationStage: BuildingApplicationStage) {
    return ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.AccountablePersonsComplete) &&
      ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.PaymentInProgress) &&
      !ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.PaymentComplete);
  }

  static isKbiSubmitted(currentApplicationStage: BuildingApplicationStage) {
    return ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.KbiSubmitComplete);
  }

  static isChangeRequestSubmitted(model?: RegistrationAmendmentsModel) {
    if (!model) return false;
    let primaryUserStatus = model.ChangeUser?.PrimaryUser?.Status ?? Status.NoChanges;
    let secondaryUserStatus = model.ChangeUser?.SecondaryUser?.Status ?? Status.NoChanges;
    return (primaryUserStatus == Status.ChangesSubmitted && secondaryUserStatus == Status.ChangesSubmitted)
      || (primaryUserStatus == Status.ChangesSubmitted && secondaryUserStatus == Status.NoChanges)
      || (primaryUserStatus == Status.NoChanges && secondaryUserStatus == Status.ChangesSubmitted);
  }

  static containsFlag(currentApplicationStage: BuildingApplicationStage, flag: BuildingApplicationStage) {
    return (currentApplicationStage & flag) == flag;
  }
}

