import { Component, Output, EventEmitter, Input, ViewChildren, QueryList } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { AddressResponseModel, AddressService } from 'src/app/services/address.service';
import { AddressSearchMode } from './address.component';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { TitleService } from 'src/app/services/title.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
@Component({
  selector: 'find-address',
  templateUrl: './find-address.component.html'
})
export class FindAddressComponent {

  @Input() searchMode: AddressSearchMode = AddressSearchMode.Building;
  @Input() searchModel!: { postcode?: string, buildingNumberName?: string };
  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Input() isStructureAddress: boolean = false;
  @Output() public onSearchPerformed = new EventEmitter<AddressResponseModel>();

  postcodeHasErrors: boolean = false;
  postcodeErrorText: string = '';

  loading = false;

  @ViewChildren("summaryError") summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(public applicationService: ApplicationService, private addressService: AddressService, private titleService: TitleService) { }

  async findAddress() {
    if (this.isPostcodeValid()) {
      this.loading = true;
      let addressResponse = await this.searchAddress();

      if (this.pap() && FieldValidations.IsNotNullOrWhitespace(this.searchModel.buildingNumberName)) {
        addressResponse.Results = addressResponse.Results.filter(x => x.Address!.toLocaleLowerCase().indexOf(this.searchModel.buildingNumberName!.toLowerCase()) > -1)
      }
      this.onSearchPerformed.emit(addressResponse);
    } else {
      this.summaryError?.first?.focus();
      this.titleService.setTitleError();
    }
  }

  isPostcodeValid(): boolean {
    let postcode = this.searchModel.postcode?.replace(' ', '');
    this.postcodeHasErrors = true;
    if (!postcode) {
      this.postcodeErrorText = 'Enter a postcode';
    } else if (postcode.length < 5 || postcode.length > 7) {
      this.postcodeErrorText = "Enter a real postcode, like 'EC3A 8BF'.";
    } else {
      this.postcodeHasErrors = false;
    }

    return !this.postcodeHasErrors;
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.postcodeHasErrors && showError ? errorMessage : undefined;
  }

  private searchAddress(): Promise<AddressResponseModel> {
    let postcode = this.searchModel.postcode?.replace(' ', '');
    switch (this.searchMode) {
      case AddressSearchMode.Building:
        return this.addressService.SearchBuildingByPostcode(postcode!);
      case AddressSearchMode.PostalAddress:
        return this.addressService.SearchPostalAddressByPostcode(postcode!);
    }
  }

  pap() {
    return this.applicationService._currentAccountablePersonIndex == 0 && !this.isStructureAddress;
  }

  addressTypeDescription() {
    if (this.searchMode == AddressSearchMode.Building) {
      return 'This address must be in England.';
    }

    return 'This address must be in England or Wales.';
  }

  getTitle() {
    return this.selfAddress ? 'Find your address' : `Find the address of ${this.addressName}`;
  }
}
