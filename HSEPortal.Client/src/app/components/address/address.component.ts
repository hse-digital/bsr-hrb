import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddressModel, AddressResponseModel } from 'src/app/services/address.service';

@Component({
  selector: 'hse-address',
  templateUrl: './address.component.html'
})
export class AddressComponent {

  @Input() searchMode: AddressSearchMode = AddressSearchMode.Building;
  @Output() onAddressConfirmed = new EventEmitter<AddressModel>();

  searchModel: { postcode?: string, addressLine1?: string } = {};
  addressResponse?: AddressResponseModel;
  selectedAddress?: AddressModel;

  step = 'find';
  private history: string[] = [];

  addressConfirmed() {
    this.onAddressConfirmed.emit(this.selectedAddress);
  }

  searchPerformed(addressResponse: AddressResponseModel) {
    if (addressResponse.Results.length > 0) {
      this.addressResponse = addressResponse;
      this.changeStepTo(addressResponse.TotalResults < 100 ? "select" : "too-many");
    } else {
      this.changeStepTo("not-found");
    }
  }

  addressSelected(selectedAddress: any) {
    this.selectedAddress = selectedAddress;
    this.changeStepTo('confirm');
  }

  manualAddressEntered(address: AddressModel) {
    this.selectedAddress = address;
    this.changeStepTo('confirm');
  }

  searchAgain() {
    this.changeStepTo('find');
  }

  enterManualAddress() {
    this.changeStepTo('manual');
  }

  navigateBack() {
    let previousStep = this.history.pop();
    this.step = previousStep ?? "find";
    if (!previousStep) history.back();
  }

  private changeStepTo(step: string) {
    this.history.push(this.step);
    this.step = step;
  }

}

export enum AddressSearchMode {
  Building,
  PostalAddress,
  FreeSearch
}