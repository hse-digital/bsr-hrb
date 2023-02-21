import { Component, Output, EventEmitter } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { HttpClient } from '@angular/common/http';
import { AddressService } from 'src/app/services/address.service';
@Component({
  selector: 'find-address',
  templateUrl: './find-address.component.html'
})
export class FindAddressComponent {

  model: { postcode?: string, addressLineOne?: string } = {}

  postcodeHasErrors: boolean = false;
  postcodeErrorText: string = '';

  @Output() public onFindAddress = new EventEmitter<{ input: string, addresses: string[] | undefined }>();

  constructor(public applicationService: ApplicationService, private addressService: AddressService, private httpClient: HttpClient) {

  }

  async canContinue() {
    this.validatePostcode();
    if (!this.postcodeHasErrors) {
      let addresses = await this.find();
      this.onFindAddress.emit({ input: this.model.postcode ?? '', addresses: addresses });
    }
  }

  validatePostcode() {
    let postcode = this.model.postcode;
    this.postcodeHasErrors = true;
    if (!postcode) {
      this.postcodeErrorText = 'Enter a postcode';
    } else if (!this.isPostcodeValid(postcode)) {
      this.postcodeErrorText = 'Enter a real postcode, like ‘EC3A 8BF’.';
    } else {
      this.postcodeHasErrors = false;
    }
  }

  isPostcodeValid(postcode: string): boolean {
    return true;
  }

  async find(): Promise<string[] | undefined> {
    let model: any = await this.addressService.SearchPostalAddressByPostcode(this.model.postcode ?? '');
    return model.Results.map((x: any) => x.Address);
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.postcodeHasErrors && showError ? errorMessage : undefined;
  }

}
