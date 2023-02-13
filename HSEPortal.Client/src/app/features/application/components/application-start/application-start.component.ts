import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  templateUrl: './application-start.component.html'
})
export class ApplicationStartComponent {

  constructor(private applicationService: ApplicationService, private router: Router){}

  static route: string = "";
  
  continueLink?: string;
  showError: boolean = false;

  continue() {
    this.showError = !this.continueLink;
    if (!this.showError) {
      this.applicationService.newApplication();
      this.router.navigate([this.continueLink]);
    }
  }
}
