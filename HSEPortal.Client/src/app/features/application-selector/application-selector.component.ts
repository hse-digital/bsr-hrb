import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { TitleService } from 'src/app/services/title.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './application-selector.component.html'
})
export class ApplicationSelectorComponent {

  constructor(private applicationService: ApplicationService, private router: Router, private titleService: TitleService) { }
  static route: string = environment.production ? "" : "select";
  static title: string = "Your application - Register a high-rise building - GOV.UK";

  continueLink?: string;
  showError: boolean = false;
  production: boolean = environment.production;

  continue() {
    this.showError = !this.continueLink;
    if (!this.showError) {
      this.applicationService.newApplication();
      this.router.navigate([this.continueLink]);
    } else {
      this.titleService.setTitleError();
    }
  }
}
