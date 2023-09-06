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

  isKbiSubmitted() {
    return this.containsFlag(BuildingApplicationStage.KbiSubmitComplete);
  }

  isAppStatusInProgressOrSubmitted() {
    return this.applicationStatuscode == BuildingApplicationStatuscode.SubmittedAwaitingAllocation || 
          this.applicationStatuscode == BuildingApplicationStatuscode.InProgress;
  }

  isApplicationSubmittedOrRaisedAnInvoice() {
    return this.containsFlag(BuildingApplicationStage.AccountablePersonsComplete) && 
      this.containsFlag(BuildingApplicationStage.PaymentInProgress) &&
      !this.containsFlag(BuildingApplicationStage.PaymentComplete);
  }

  isApplicationSubmittedAndPaid() {
    return this.containsFlag(BuildingApplicationStage.AccountablePersonsComplete) && 
      this.containsFlag(BuildingApplicationStage.PaymentComplete);
  }

  containsFlag(flag: BuildingApplicationStage) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

}

