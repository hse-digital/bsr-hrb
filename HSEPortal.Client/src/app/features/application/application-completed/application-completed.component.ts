import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BroadcastChannelPrimaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { ApplicationService, BuildingApplicationStage, BuildingApplicationStatuscode } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-application-completed',
  templateUrl: './application-completed.component.html'
})
export class ApplicationCompletedComponent implements OnInit, CanActivate {

  static route: string = 'application-completed';
  static title: string = "Application completed - Register a high-rise building - GOV.UK";
  
  shouldRender: boolean = false;
  KbiSubmissionDate?: string;
  payment?: any;
  applicationStatuscode: BuildingApplicationStatuscode = BuildingApplicationStatuscode.New;

  constructor(public applicationService: ApplicationService, private navigationService: NavigationService) {

  }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return true;
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.PaymentComplete) == BuildingApplicationStage.PaymentComplete
      && (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.KbiSubmitComplete) == BuildingApplicationStage.KbiSubmitComplete;
  }

  async ngOnInit(): Promise<void> {
    this.shouldRender = false;

    this.sendApplicationDataToBroadcastChannel();

    this.KbiSubmissionDate = await this.applicationService.getSubmissionDate();

    this.applicationStatuscode = await this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!);

    var payments = await this.applicationService.getApplicationPayments()
    this.payment = payments.find(x => x.bsr_govukpaystatus == "success");

    this.shouldRender = true;
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
      ApplicationStageHelper.isApplicationSubmittedOrRaisedAnInvoice(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.applicationService.model.PaymentInvoiceDetails?.Status);
  }

  isViewTwo() {
    return ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isNotNewInProgressSubmittedRegisteredWithdrawnRejected(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndPaid(this.applicationService.model.ApplicationStatus);
  }

  isViewThree() {
    return ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isRegistered(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndPaid(this.applicationService.model.ApplicationStatus);
  }

  isViewFour() {
    return !ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isAppStatusInProgressOrSubmitted(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedOrRaisedAnInvoice(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.applicationService.model.PaymentInvoiceDetails?.Status);
  }

  isViewFive() {
    return !ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isNotNewInProgressSubmittedRegisteredWithdrawnRejected(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndPaid(this.applicationService.model.ApplicationStatus);
  }

  isViewSix() {
    return !ApplicationStageHelper.isKbiSubmitted(this.applicationService.model.ApplicationStatus) &&
      StatuscodeHelper.isRegistered(this.applicationStatuscode) &&
      ApplicationStageHelper.isApplicationSubmittedAndPaid(this.applicationService.model.ApplicationStatus);
  }

  isViewSeven() {
    return ApplicationStageHelper.isApplicationSubmittedOrRaisedAnInvoice(this.applicationService.model.ApplicationStatus, this.applicationService.model.PaymentType, this.applicationService.model.PaymentInvoiceDetails?.Status) &&
    ApplicationStageHelper.isChangeRequestSubmitted();
  }

  isViewThirteen() {
    return StatuscodeHelper.isRejected(this.applicationStatuscode);
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
      ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.PaymentInProgress) &&
      !ApplicationStageHelper.containsFlag(currentApplicationStage, BuildingApplicationStage.PaymentComplete);

    let raisedAnInvoice = paymentType == 'invoice' && paymentInvoiceStatus == 'awaiting';

    return isAppSubmitted || raisedAnInvoice;
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

  static isChangeRequestSubmitted() {
    return false;
  }

  static containsFlag(currentApplicationStage: BuildingApplicationStage, flag: BuildingApplicationStage) {
    return (currentApplicationStage & flag) == flag;
  }
}

