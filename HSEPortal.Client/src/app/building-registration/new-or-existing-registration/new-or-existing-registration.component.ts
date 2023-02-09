import { Component } from '@angular/core';
import { IdleTimerService } from '../../services/idle-timer.service';

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
