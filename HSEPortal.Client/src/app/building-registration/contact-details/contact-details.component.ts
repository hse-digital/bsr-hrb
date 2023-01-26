import { Component } from '@angular/core';

@Component({
  selector: 'hse-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent {

  showError: boolean = false;

  hasFirstName: boolean = false;
  hasLastName: boolean = false;

  updateErrorStatus() {
    this.showError = !this.hasFirstName || !this.hasLastName;
  }

  firstNameModelChange(event: any) {
    this.hasFirstName = event.length > 0;
  }

  lastNameModelChange(event: any) {
    this.hasLastName = event.length > 0;
  }
}
