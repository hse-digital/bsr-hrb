import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { KbiService } from 'src/app/services/kbi.service';

@Component({
  selector: 'hse-declaration',
  templateUrl: './declaration.component.html'
})
export class DeclarationComponent extends BaseComponent implements OnInit {
  static route: string = 'declaration';
  static title: string = "Declaration - Register a high-rise building - GOV.UK";

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, private kbiService: KbiService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  async ngOnInit() {
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiSubmitInProgress;
    await this.applicationService.updateApplication();
  }

  canContinue(): boolean {
    return true;
  }

  override async onSave(): Promise<void> {
    await this.kbiService.syncConnectionsAndDeclaration(this.applicationService.model.Kbi!);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(ConfirmComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return this.containsFlag(BuildingApplicationStatus.KbiConnectionsComplete);
  }

  containsFlag(flag: BuildingApplicationStatus) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

}
