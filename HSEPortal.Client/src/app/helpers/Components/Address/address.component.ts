import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'hse-address',
  templateUrl: './address.component.html'
})
export class AddressComponent {

  @Output() public onAddressConfirmed = new EventEmitter();

  public selectedAddress?: string;
  public address?: string;
  public addresses?: string[];

  private history: string[] = [];

  step = 'find';

  constructor() { }

  addressHasErrors = false;

  addressConfirmed() {
    this.onAddressConfirmed.emit();
  }

  findAddress(find: { input: string, addresses: string[] | undefined }) {
    this.address = find.input;
    if (find.addresses && find.addresses.length > 0) {
      this.addresses = find.addresses;
      this.changeStepTo(find.addresses.length < 100 ? "select" : "too-many");
    } else {
      this.changeStepTo("not-found");
    }
  }

  selectAddress(selectedAddress: any) {
    this.selectedAddress = selectedAddress;
    this.changeStepTo('confirm');
  }

  searchAgain() {
    this.changeStepTo('find');
  }

  enterManualAddress() {
    this.changeStepTo('manual');
  }

  manualAddress(manualAddress: { AddressLineOne?: string, AddressLineTwo?: string, TownOrCity?: string, Postcode?: string }) {
    this.selectedAddress = `${manualAddress.AddressLineOne}, ${manualAddress.Postcode}`;
    this.changeStepTo('confirm');
  }

  changeStepTo(step: string) {
    this.history.push(this.step);
    this.step = step;
  }

  navigateBack() {
    let previousStep = this.history.pop();
    this.step = previousStep ?? "find";
    if (!previousStep) history.back();
  }

}
