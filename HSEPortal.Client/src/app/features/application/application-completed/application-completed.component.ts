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

  KbiSubmissionDate?: string;
  payment?: any;
  applicationStatuscode?: BuildingApplicationStatuscode;

  constructor(public applicationService: ApplicationService, private navigationService: NavigationService) {
  
  }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return true;
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.PaymentComplete) == BuildingApplicationStage.PaymentComplete
      && (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.KbiSubmitComplete) == BuildingApplicationStage.KbiSubmitComplete;
  }

  async ngOnInit(): Promise<void> {
    this.sendApplicationDataToBroadcastChannel();

    this.KbiSubmissionDate = await this.applicationService.getSubmissionDate();    
    
    this.applicationStatuscode = await this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!);

    var payments = await this.applicationService.getApplicationPayments()
    this.payment = payments.find(x => x.bsr_govukpaystatus == "success");
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
    let result = this.isKbiSubmitted() &&
      this.isAppStatusInProgressOrSubmitted() &&
      this.isApplicationSubmittedOrRaisedAnInvoice();
    return true;
  }

  isViewTwo() {
    return this.isKbiSubmitted() &&
      this.isNotNewInProgressSubmittedRegisteredWithdrawnRejected() &&
      this.isApplicationSubmittedAndPaid();
  }

  isViewThree() {
    return this.isKbiSubmitted() &&
      this.isRegistered() &&
      this.isApplicationSubmittedAndPaid();
  }

  isViewFour() {
    return !this.isKbiSubmitted() &&
    this.isAppStatusInProgressOrSubmitted() &&
    this.isApplicationSubmittedOrRaisedAnInvoice();
  }

  isViewFive() {
    return !this.isKbiSubmitted() &&
      this.isNotNewInProgressSubmittedRegisteredWithdrawnRejected() &&
      this.isApplicationSubmittedAndPaid();
  }

  isViewSix() {
    return !this.isKbiSubmitted() &&
      this.isRegistered() &&
      this.isApplicationSubmittedAndPaid();
  }

  isViewSeven() {
    return this.isApplicationSubmittedOrRaisedAnInvoice() &&
      this.isChangeRequestSubmitted();
  }

  isViewThirteen() {
    return this.isRejected();
  }

  // Kbi

  isKbiSubmitted() {
    return this.containsFlag(BuildingApplicationStage.KbiSubmitComplete);
  }

  // Statuscode

  isAppStatusInProgressOrSubmitted() {
    return this.applicationStatuscode == BuildingApplicationStatuscode.SubmittedAwaitingAllocation || 
          this.applicationStatuscode == BuildingApplicationStatuscode.InProgress;
  }

  isNotNewInProgressSubmittedRegisteredWithdrawnRejected() {
    return this.applicationStatuscode != BuildingApplicationStatuscode.New && 
          this.applicationStatuscode != BuildingApplicationStatuscode.InProgress &&
          this.applicationStatuscode != BuildingApplicationStatuscode.SubmittedAwaitingAllocation &&
          this.applicationStatuscode != BuildingApplicationStatuscode.Registered &&
          this.applicationStatuscode != BuildingApplicationStatuscode.Withdrawn &&
          this.applicationStatuscode != BuildingApplicationStatuscode.Rejected;
  }

  isRegistered() {
    return this.applicationStatuscode == BuildingApplicationStatuscode.Registered;
  }

  isRejected() {
    return this.applicationStatuscode == BuildingApplicationStatuscode.Rejected;
  }

  // submitted 

  isApplicationSubmittedOrRaisedAnInvoice() {
    let isAppSubmitted = this.containsFlag(BuildingApplicationStage.AccountablePersonsComplete) && 
          this.containsFlag(BuildingApplicationStage.PaymentInProgress) &&
          !this.containsFlag(BuildingApplicationStage.PaymentComplete);
          
    let raisedAnInvoice = this.applicationService.model.PaymentType == 'invoice' &&
          this.applicationService.model.PaymentInvoiceDetails?.Status == 'awaiting';

    return isAppSubmitted || raisedAnInvoice; 
  }

  isApplicationSubmittedAndPaid() {
    return this.containsFlag(BuildingApplicationStage.AccountablePersonsComplete) && 
      this.containsFlag(BuildingApplicationStage.PaymentComplete);
  }

  isOnlySubmitted() {
    return this.containsFlag(BuildingApplicationStage.AccountablePersonsComplete) && 
    this.containsFlag(BuildingApplicationStage.PaymentInProgress) &&
    !this.containsFlag(BuildingApplicationStage.PaymentComplete);
  }

  // submitted change request

  isChangeRequestSubmitted() {
    return false;
  }

  containsFlag(flag: BuildingApplicationStage) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

}

