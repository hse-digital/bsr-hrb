import { Component } from '@angular/core';

@Component({
  templateUrl: './contact-details-name.component.html'
})
export class ContactDetailsNameComponent {

  contactDetails: { firstName?: string, lastName?: string } = {};
  showError: boolean = false;

  updateErrorStatus() {
    this.showError = !this.contactDetails.firstName || !this.contactDetails.lastName;
  }

  getContinueLink(): string | undefined {
    return !this.showError && this.contactDetails.firstName && this.contactDetails.lastName
      ? '/building-registration/contact-details/phone'
      : undefined;
  }

  getErrorText(value: any, errorText: string): string | undefined {
    return this.showError && !value ? errorText : undefined;
  }
}
