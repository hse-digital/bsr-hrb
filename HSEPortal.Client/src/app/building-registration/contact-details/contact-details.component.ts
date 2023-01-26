import { Component } from '@angular/core';

@Component({
  selector: 'hse-contact-details',
  templateUrl: './contact-details.component.html'
})
export class ContactDetailsComponent {

  contactDetails: { firstName?: string, lastName?: string } = {};
  showError: boolean = false;

  updateErrorStatus() {
    this.showError = !this.contactDetails.firstName || !this.contactDetails.lastName;
  }

  getContinueLink(): string | undefined {
    return !this.showError && this.contactDetails.firstName && this.contactDetails.lastName
      ? '/building-registration'
      : undefined;
  }

  getErrorText(value: any, errorText: string): string | undefined {
    return this.showError && !value ? errorText : undefined;
  }
}
