import { Component } from '@angular/core';

@Component({
  templateUrl: './new-or-existing-registration.component.html',
  styleUrls: ['./new-or-existing-registration.component.scss']
})
export class NewOrExistingRegistrationComponent {
  continueLink?: string;

  showError: boolean = false;

  updateErrorStatus() {
    this.showError = !this.continueLink;
  }

}
