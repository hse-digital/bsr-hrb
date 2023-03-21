import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  templateUrl: './returning-application.component.html'
})
export class ReturningApplicationComponent extends BaseComponent{
  static route: string = "returning-application";
  static title: string = "Continue a saved application - Register a high-rise building - GOV.UK";

  step = "enterdata";
  emailAddress?: string;
  applicationNumber?: string;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
    this.updateOnSave = false;
  }

  canContinue(): boolean {
    return false;
  }

  showVerifyApplication() {
    this.step = 'verify';
  }

  showResendStep() {
    this.step = 'resend';
  }
}
