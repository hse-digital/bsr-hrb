import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddressModel, AddressResponseModel } from 'src/app/services/address.service';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'select-address',
  templateUrl: './select-address.component.html'
})
export class SelectAddressComponent {

  addressHasErrors = false;
  selectedAddress?: AddressModel;

  @Input() addressResponse?: AddressResponseModel;
  @Input() searchModel: { postcode?: string, addressLine1?: string } = {}

  @Output() onAddressSelected = new EventEmitter<AddressModel>();
  @Output() onSearchAgain = new EventEmitter();
  @Output() onEnterManualAddress = new EventEmitter();

  constructor(public applicationService: ApplicationService) {}

  continue() {
    this.addressHasErrors = !this.selectedAddress;
    if (!this.addressHasErrors) {
      this.onAddressSelected.emit(this.selectedAddress);
    }
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.addressHasErrors && showError ? errorMessage : undefined;
  }

  get numberOfAddresses(): number | undefined {
    return this.addressResponse?.Results.length;
  }
}