import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddressModel, AddressResponseModel } from 'src/app/services/address.service';

@Component({
  selector: 'hse-address',
  templateUrl: './address.component.html'
})
export class AddressComponent implements OnInit {

  @Input() searchMode: AddressSearchMode = AddressSearchMode.Building;
  @Input() address?: AddressModel;
  @Input() addressName!: string;
  @Output() onAddressConfirmed = new EventEmitter();

  searchModel: { postcode?: string, addressLine1?: string } = {};
  addressResponse?: AddressResponseModel;

  step = 'find';
  private history: string[] = [];

  ngOnInit(): void {
    if(this.address) {
      this.changeStepTo('confirm');
      this.history = [];
    }
  }

  addressConfirmed() {
    this.onAddressConfirmed.emit(this.address);
  }

  searchPerformed(addressResponse: AddressResponseModel) {
    if (addressResponse.Results.length > 0) {
      this.addressResponse = addressResponse;
      if (this.addressResponse.Results.length == 1) {
        this.address = this.addressResponse.Results[0];
        this.changeStepTo('confirm');
      } else {
        this.changeStepTo(addressResponse.TotalResults < 100 ? "select" : "too-many");
      }
    } else {
      this.changeStepTo("not-found");
    }
  }

  addressSelected(selectedAddress: any) {
    this.address = selectedAddress;
    this.changeStepTo('confirm');
  }

  manualAddressEntered(address: AddressModel) {
    this.address = address;
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
    if (!previousStep) {
      history.back();
    } else {
      this.step = previousStep;
    }
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