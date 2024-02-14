import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, BuildingApplicationStage, Status } from 'src/app/services/application.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { KbiService } from 'src/app/services/kbi.service';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-declaration',
  templateUrl: './declaration.component.html'
})
export class DeclarationComponent extends PageComponent<void> {
  static route: string = 'declaration';
  static title: string = "Declaration - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute, private kbiService: KbiService) {
    super(activatedRoute);
  }

  override async onSave(): Promise<void> {
    if (this.applicationService.model.Versions.length > 1 && this.applicationService.currentVersion.Name != "original") {
      
      let currentVersionName = this.applicationService.currentVersion.Name;
      let previousVersionName = this.applicationService.previousVersion.Name;
      if (currentVersionName != previousVersionName) {
        this.applicationService.previousVersion.ReplacedBy = currentVersionName;
      }

      this.applicationService.currentVersion.Submitted = true;
    } 
    await this.kbiService.syncConnectionsAndDeclaration(this.applicationService.currentVersion.Kbi!);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStage.KbiSubmitInProgress;
    await this.applicationService.updateApplication();
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return this.containsFlag(BuildingApplicationStage.KbiConnectionsComplete);
  }

  override isValid(): boolean {
    return true;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(ConfirmComponent.route, this.activatedRoute);
  }

  containsFlag(flag: BuildingApplicationStage) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

}
