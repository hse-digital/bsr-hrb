import { Component } from '@angular/core';

@Component({
  templateUrl: './contact-details-phone.component.html'
})
export class ContactDetailsPhoneComponent {

  contactDetails: { phoneNumber?: string } = {};
  showError: boolean = false;

  private _hasErrorBeenShown: boolean = false;
  private _validPhoneNumber = [
    { prefix: '+44', length: 13 },
    { prefix: '0', length: 11 },
  ]

  private isPhoneNumberValid(): boolean {
    let phoneNumber = this.cleanPhoneNumber();
    for (let i = 0; i < this._validPhoneNumber.length; i++) {
      let valid = this._validPhoneNumber[i];
      if (Number(phoneNumber) && phoneNumber.startsWith(valid.prefix) && phoneNumber.length == valid.length)
        return true;
    }
    return false;
  }

  private cleanPhoneNumber(): string {
    return this.contactDetails.phoneNumber?.replaceAll(' ', '') ?? '';
  }

  evaluateInput() {
    // The input is only evaluated after displaying an error.
    if (this._hasErrorBeenShown) this.updateErrorStatus()
  }

  updateErrorStatus() {
    this.showError = !this.isPhoneNumberValid();
    if (this.showError) this._hasErrorBeenShown = true;
  }

  getContinueLink(): string | undefined {
    return !this.showError && this.isPhoneNumberValid()
      ? '/building-registration/contact-details/email'
      : undefined;
  }

  getErrorText(errorText: string): string | undefined {
    return this.showError && !this.isPhoneNumberValid() ? errorText : undefined;
  }
}
