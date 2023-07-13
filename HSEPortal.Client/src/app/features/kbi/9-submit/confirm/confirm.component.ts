import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { DeclarationComponent } from '../declaration/declaration.component';
import { BroadcastChannelPrimaryHelper } from 'src/app/helpers/BroadcastChannelHelper';

@Component({
  selector: 'hse-confirm',
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent extends BaseComponent implements OnInit {
  static route: string = 'information-submitted';
  static title: string = "Structure and safety information submitted - Register a high-rise building - GOV.UK";

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  async ngOnInit() {
    this.sendApplicationDataToBroadcastChannel();
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiSubmitComplete;
    await this.applicationService.updateApplication();
  }  
  
  private sendApplicationDataToBroadcastChannel() {
    new BroadcastChannelPrimaryHelper()
      .OpenChannel("application_data")
      .SendDataWhenSecondaryJoinChannel(this.applicationService.model);
  }

  canContinue(): boolean {
    return true;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(DeclarationComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return this.containsFlag(BuildingApplicationStatus.KbiSubmitInProgress);
  }

  containsFlag(flag: BuildingApplicationStatus) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

  async newApplication() {
    await this.navigationService.navigate('/select');
  }

}
