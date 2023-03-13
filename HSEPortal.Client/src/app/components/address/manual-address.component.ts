import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { AddressModel } from 'src/app/services/address.service';
import { AddressSearchMode } from './address.component';

@Component({
  selector: 'manual-address',
  templateUrl: './manual-address.component.html'
})
export class ManualAddressComponent {

  @Input() searchMode: AddressSearchMode = AddressSearchMode.Building;
  @Output() onSearchAgain = new EventEmitter();
  @Output() onAddressEntered = new EventEmitter<AddressModel>();
  @Input() addressName?: string;
  @Input() selfAddress = false;

  hasErrors = false;
  errors = {
    lineOneHasErrors: false,
    townOrCityHasErrors: false,
    postcode: { hasErrors: false, errorText: '' },
  }

  model: AddressModel = { IsManual: true }

  constructor(public applicationService: ApplicationService) { }

  confirmAddress() {
    if (this.isModelValid()) {
      this.onAddressEntered.emit(this.model);
    }
  }

  private isModelValid() {
    this.errors.lineOneHasErrors = !this.model.Address;
    this.errors.townOrCityHasErrors = !this.model.Town;
    this.isPostcodeValid();

    this.hasErrors = this.errors.lineOneHasErrors || this.errors.townOrCityHasErrors || this.errors.postcode.hasErrors || this.errors.postcode.hasErrors;

    return !this.hasErrors;
  }

  private isPostcodeValid(): boolean {
    let postcode = this.model.Postcode?.replace(' ', '');
    this.errors.postcode.hasErrors = true;
    if (!postcode) {
      this.errors.postcode.errorText = 'Enter a postcode';
    } else if (postcode.length < 5 && postcode.length > 7) {
      this.errors.postcode.errorText = "Enter a real postcode, like 'EC3A 8BF'.";
    } else {
      this.errors.postcode.hasErrors = false;
    }

    return !this.errors.postcode.hasErrors;
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasErrors && showError ? errorMessage : undefined;
  }

  addressTypeDescription() {
    if (this.searchMode == AddressSearchMode.Building) {
      return 'This address must be in England.';
    }

    return 'This address must be in England or Wales.';
  }

  getTitle() {
    return this.selfAddress ? 'Enter you address manually' : `Enter address manually for ${this.addressName}`;
  }
}
