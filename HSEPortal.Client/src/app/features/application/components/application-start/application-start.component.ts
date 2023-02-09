import { Component } from '@angular/core';

@Component({
  templateUrl: './application-start.component.html'
})
export class ApplicationStartComponent {
  static route: string = "";
  
  continueLink?: string;
  showError: boolean = false;

  updateErrorStatus() {
    this.showError = !this.continueLink;
  }

}
