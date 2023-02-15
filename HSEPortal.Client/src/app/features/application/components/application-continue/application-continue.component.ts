import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './application-continue.component.html'
})
export class ApplicationContinueComponent extends BaseComponent implements IHasNextPage {
  static route: string = "continue";

  model: { emailAddress?: string, applicationNumber?: string } = {}
  verifyStep = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative('security-code', activatedRoute);
  }

  canContinue(): boolean {
    return false;
  }

  showVerifyApplication(emailAddress: string, applicationNumber: string) {
    this.model.emailAddress = emailAddress;
    this.model.applicationNumber = applicationNumber;
    this.verifyStep = true;
  }
}
