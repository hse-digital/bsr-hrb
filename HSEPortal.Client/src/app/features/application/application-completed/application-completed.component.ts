import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BroadcastChannelPrimaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
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

  constructor(public applicationService: ApplicationService, private navigationService: NavigationService) {
  
  }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete
      && (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.KbiSubmitComplete) == BuildingApplicationStatus.KbiSubmitComplete;
  }

  async ngOnInit(): Promise<void> {
    this.sendApplicationDataToBroadcastChannel();

    this.KbiSubmissionDate = await this.applicationService.getSubmissionDate();    
    
    var payments = await this.applicationService.getApplicationPayments()
    this.payment = payments.find(x => x.bsr_govukpaystatus == "success");
  }

  private sendApplicationDataToBroadcastChannel() {
    new BroadcastChannelPrimaryHelper()
      .OpenChannel("application_data")
      .SendDataWhenSecondaryJoinChannel(this.applicationService.model);
  }

  async newApplication() {
    await this.navigationService.navigate('/select');
  }
  
  private sectionBuildingName() {
    return this.applicationService.model.NumberOfSections == 'one' ? this.applicationService.model.BuildingName :
      this.applicationService.currentSection.Name;
  }
}
