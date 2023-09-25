import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AddressModel, AddressResponseModel } from 'src/app/services/address.service';

@Component({
  selector: 'hse-address',
  templateUrl: './address.component.html'
})
export class AddressComponent implements OnInit {

  @ViewChild("backButton") public backButton?: ElementRef;

  @Input() searchMode: AddressSearchMode = AddressSearchMode.Building;
  @Input() address?: AddressModel;
  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Output() onAddressConfirmed = new EventEmitter();
  @Output() onChangeStep = new EventEmitter();

  searchModel: { postcode?: string } = {};
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
    if (!this.address?.PostcodeEntered || this.address.PostcodeEntered.length == 0) {
      this.address!.PostcodeEntered = this.searchModel.postcode ?? this.address?.Postcode;
    }
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
    this.searchModel.postcode = address?.Postcode;
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
      this.onChangeStep.emit(this.step);
    }
  }

  private changeStepTo(step: string) {
    this.history.push(this.step);
    this.step = step;
    this.resetFocus();
    this.onChangeStep.emit(this.step);
  }

  resetFocus() {
    const mainHeader = document.querySelector('#gouvk-header-service-name');
    if (mainHeader) {
      (mainHeader as HTMLElement).focus();
      (mainHeader as HTMLElement).blur();
    }
  }

}

export enum AddressSearchMode {
  Building,
  PostalAddress
}
