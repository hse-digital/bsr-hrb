import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, BuildingApplicationStage } from 'src/app/services/application.service';
import { DeclarationComponent } from '../declaration/declaration.component';
import { BroadcastChannelPrimaryHelper } from 'src/app/helpers/BroadcastChannelHelper';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-confirm',
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent extends PageComponent<void> {
  static route: string = 'information-submitted';
  static title: string = "Structure and safety information submitted - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }
  
  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.sendApplicationDataToBroadcastChannel();
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStage.KbiSubmitComplete;
    await this.applicationService.updateApplication();
  }

  override onSave(applicationService: ApplicationService): Promise<void> {
    throw new Error('Method not implemented.');
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return this.containsFlag(BuildingApplicationStage.KbiSubmitInProgress);
  }

  override isValid(): boolean {
    return true;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(DeclarationComponent.route, this.activatedRoute);
  }

  private sendApplicationDataToBroadcastChannel() {
    new BroadcastChannelPrimaryHelper()
      .OpenChannel(this.applicationService.model.id!)
      .SendDataWhenSecondaryJoinChannel(this.applicationService.model);
  }

  containsFlag(flag: BuildingApplicationStage) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

  async newApplication() {
    await this.navigationService.navigate('/select');
  }
}
