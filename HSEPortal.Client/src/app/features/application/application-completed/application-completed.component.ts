import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { BroadcastChannelPrimaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, BuildingApplicationStage, BuildingApplicationStatuscode, BuildingRegistrationVersion } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ConfirmInformationBsrHoldsComponent } from '../application-certificate/confirm-information-bsr-holds/confirm-information-bsr-holds.component';
import { ComplianceNoticeNumbersComponent } from '../application-certificate/compliance-notice-numbers/compliance-notice-numbers.component';
import { Section89DeclarationComponent } from '../application-certificate/section-89-declaration/section-89-declaration.component';
import { UploadCompletionCertificateComponent } from '../building-summary/upload-completion-certificate/upload-completion-certificate.component';
import { InvoicingDetailsComponent } from '../application-certificate/invoicing-details/invoicing-details.component';
import { UploadDocumentsComponent } from '../application-certificate/upload-documents/upload-documents.component';

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

  constructor(public applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {

  }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.AccountablePersonsComplete) == BuildingApplicationStage.AccountablePersonsComplete;
  }

  applicationStatus = {
    paid: false,
    kbiSubmitted: false,
    changesSubmitted: false,
    changesAccepted: false,
    withdrawalSubmitted: false,
    withdrawalAccepted: false,
    registrationAccepted: false,
    removalSubmitted: false,
    removalAccepted: false,
    showLinks: false,
    bacInvitation: false,
    bacStatus: null
  };

  async ngOnInit(): Promise<void> {
    this.shouldRender = false;

    await this.applicationService.syncPayment();
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 4000));

    this.sendApplicationDataToBroadcastChannel();

    var [submittionDate, kbiSubmittionDate, applicationStatusCode, payments, _] = await Promise.all([
      this.applicationService.getSubmissionDate(),
      this.applicationService.getKbiSubmissionDate(),
      this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!),
      this.applicationService.getApplicationPayments(),
      this.updateApplicationStatus()
    ]);

    this.submittionDate = submittionDate;
    this.kbiSubmittionDate = kbiSubmittionDate;
    this.applicationStatuscode = applicationStatusCode;

    if (payments != undefined && payments.some((x: { bsr_govukpaystatus: string; }) => x.bsr_govukpaystatus == "success" || x.bsr_govukpaystatus == "open")) {
      this.initPayment(payments);
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

  bacIsEmpty() {
    return this.applicationService.model.ApplicationCertificate == null;
  }

  async navigateToBac() {
    await this.navigationService.navigateRelative(`certificate/confirm-information-bsr-holds`, this.activatedRoute);
  }

  bacIsInProgress() {
    return this.applicationService.model.ApplicationCertificate != null;
  }

  async continueBac() {
    if (!this.applicationService.model.ApplicationCertificate?.BsrInformationConfirmed) {
      await this.navigationService.navigateRelative(`certificate/confirm-information-bsr-holds`, this.activatedRoute);
    } else if (!this.applicationService.model.ApplicationCertificate?.ComplianceNoticeNumbers) {
      await this.navigationService.navigateRelative(`certificate/compliance-notice-numbers`, this.activatedRoute);
    } else if (!this.applicationService.model.ApplicationCertificate?.Section89DeclarationConfirmed) {
      await this.navigationService.navigateRelative(`certificate/section-89-declaration`, this.activatedRoute);
    } else if (!this.applicationService.model.ApplicationCertificate?.Files || this.applicationService.model.ApplicationCertificate?.Files?.length < 1) {
      await this.navigationService.navigateRelative(`certificate/upload-documents`, this.activatedRoute);
    } else if (this.missingOngoingInvoiceDetails()) {
      await this.navigationService.navigateRelative(`certificate/invoicing-details`, this.activatedRoute);
    } else if (!this.applicationService.model.ApplicationCertificate.PaymentType) {
      await this.navigationService.navigateRelative(`certificate/choose-payment`, this.activatedRoute);
    } else if (this.applicationService.model.ApplicationCertificate.PaymentType == "invoice" && this.applicationService.model.ApplicationCertificate.UseSameAsOngoingInvoiceDetails == null) {
      await this.navigationService.navigateRelative(`certificate/same-invoice-details`, this.activatedRoute);
    } else if (this.missingNewInvoiceDetails()) {
      await this.navigationService.navigateRelative(`certificate/invoicing-details-upfront-payment`, this.activatedRoute);
    }
  }

  private missingOngoingInvoiceDetails(): boolean {
    return this.applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails == undefined ||
      !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails.Name) ||
      !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails.Email) ||
      !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails.AddressLine1) ||
      !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails.Town) ||
      !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails.Postcode) ||
      (this.applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails.OrderNumberOption != "noneed" && !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.OngoingChangesInvoiceDetails.Postcode));
  }

  private missingNewInvoiceDetails(): boolean {
    return this.applicationService.model.ApplicationCertificate?.UseSameAsOngoingInvoiceDetails == false && (
      this.applicationService.model.ApplicationCertificate?.ApplicationInvoiceDetails == undefined ||
      !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.ApplicationInvoiceDetails.Name) ||
      !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.ApplicationInvoiceDetails.Email) ||
      !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.ApplicationInvoiceDetails.AddressLine1) ||
      !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.ApplicationInvoiceDetails.Town) ||
      !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.ApplicationInvoiceDetails.Postcode) ||
      (this.applicationService.model.ApplicationCertificate?.ApplicationInvoiceDetails.OrderNumberOption != "noneed" && !FieldValidations.IsNotNullOrWhitespace(this.applicationService.model.ApplicationCertificate?.ApplicationInvoiceDetails.Postcode))
    );
  }

  private async updateApplicationStatus() {
    var latestCrAccepted = await this.applicationService.isChangeRequestAccepted();

    this.applicationStatus.paid = this.payment != undefined;
    this.applicationStatus.kbiSubmitted = ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus);
    this.applicationStatus.changesSubmitted = ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.Versions);
    this.applicationStatus.changesAccepted = latestCrAccepted == 'complete';
    this.applicationStatus.withdrawalSubmitted = this.applicationService.model.RegistrationAmendmentsModel?.Deregister?.AreYouSure != undefined;
    this.applicationStatus.withdrawalAccepted = this.applicationStatus.withdrawalSubmitted && latestCrAccepted == 'withdrawn';
    this.applicationStatus.registrationAccepted = this.applicationStatuscode == BuildingApplicationStatuscode.Registered || this.applicationStatuscode == BuildingApplicationStatuscode.RegisteredKbiValidated;
    this.applicationStatus.removalSubmitted = this.applicationService.model.RegistrationAmendmentsModel?.Deregister?.AreYouSure != undefined;
    this.applicationStatus.removalAccepted = this.applicationStatus.removalSubmitted && latestCrAccepted == 'withdrawn';
    this.applicationStatus.bacInvitation = await this.applicationService.getBacInvitation();
    this.applicationStatus.bacStatus = await this.applicationService.getBacApplicationStatus();

    this.applicationStatus.showLinks = (!this.applicationStatus.withdrawalSubmitted && !this.applicationStatus.withdrawalAccepted && !this.applicationStatus.registrationAccepted);
    this.shouldRender = true;
  }

  async newApplication() {
    await this.navigationService.navigate('/select');
  }

  isViewOne(): boolean {
    return ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isAppStatusInProgressOrSubmitted(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndInvoicePaid(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.payment?.bsr_govukpaystatus) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.Versions);
  }

  isViewOneA(): boolean {
    return ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isAppStatusInProgressOrSubmitted(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndRaisedAnInvoice(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.applicationService.model.PaymentInvoiceDetails?.Status) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.Versions);
  }

  isViewTwo() {
    return ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isNotNewInProgressSubmittedRegisteredWithdrawnRejected(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndPaid(this.applicationService.model.ApplicationStatus) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.Versions);
  }

  isViewThree() {
    return ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isRegistered(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndPaid(this.applicationService.model.ApplicationStatus) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.Versions);
  }

  isViewFour() {
    return !ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isAppStatusInProgressOrSubmitted(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndInvoicePaid(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.payment?.bsr_govukpaystatus) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.Versions);
  }

  isViewFourA() {
    return !ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isAppStatusInProgressOrSubmitted(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndRaisedAnInvoice(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.applicationService.model.PaymentInvoiceDetails?.Status) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.Versions);
  }

  isViewFive() {
    return !ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isNotNewInProgressSubmittedRegisteredWithdrawnRejected(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndPaid(this.applicationService.model.ApplicationStatus) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.Versions);
  }

  isViewSix() {
    return !ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isRegistered(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndPaid(this.applicationService.model.ApplicationStatus) &&
      !ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.Versions);
  }

  isViewSeven() {
    return ApplicationStageHelper.isApplicationSubmittedOrRaisedAnInvoice(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.applicationService.model.PaymentInvoiceDetails?.Status) &&
      ApplicationStageHelper.isChangeRequestSubmitted(this.applicationService.model.Versions) &&
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
    if (this.isViewOne()) {
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
    } else if (this.isViewFive()) {
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

export class ApplicationStageHelper {
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

  static isChangeRequestSubmitted(versions?: BuildingRegistrationVersion[]) {
    return !!versions && versions.length > 1 && FieldValidations.IsNotNullOrWhitespace(versions[0].ReplacedBy);
  }

  static isChangeRequestAccepted(versions?: BuildingRegistrationVersion[]) {
    return !!versions && versions.length > 1 && !FieldValidations.IsNotNullOrWhitespace(versions[0].ReplacedBy) && versions[0].Submitted == true;
  }

  static containsFlag(currentApplicationStage: BuildingApplicationStage, flag: BuildingApplicationStage) {
    return (currentApplicationStage & flag) == flag;
  }
}

