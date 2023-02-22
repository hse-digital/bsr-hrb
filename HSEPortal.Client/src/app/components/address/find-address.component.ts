import { Component, Output, EventEmitter } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { AddressResponseModel, AddressService } from 'src/app/services/address.service';
@Component({
  selector: 'find-address',
  templateUrl: './find-address.component.html'
})
export class FindAddressComponent {

  model: { postcode?: string, addressLineOne?: string } = {}

  postcodeHasErrors: boolean = false;
  postcodeErrorText: string = '';

  @Output() public onSearchPerformed = new EventEmitter<AddressResponseModel>();

  constructor(public applicationService: ApplicationService, private addressService: AddressService) {}

  async findAddress() {
    if (this.isPostcodeValid()) {
      let addressResponse = await this.addressService.SearchPostalAddressByPostcode(this.model.postcode!);
      this.onSearchPerformed.emit(addressResponse);
    }
  }

  isPostcodeValid(): boolean {
    let postcode = this.model.postcode;
    this.postcodeHasErrors = true;
    if (!postcode) {
      this.postcodeErrorText = 'Enter a postcode';
    } else if (postcode.replace(' ', '').length != 7) {
      this.postcodeErrorText = "Enter a real postcode, like 'EC3A 8BF'.";
    } else {
      this.postcodeHasErrors = false;
    }

    return !this.postcodeHasErrors;
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.postcodeHasErrors && showError ? errorMessage : undefined;
  }

}
