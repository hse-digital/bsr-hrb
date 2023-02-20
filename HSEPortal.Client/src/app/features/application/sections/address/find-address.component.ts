import { Component, Output, EventEmitter } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { HttpClient } from '@angular/common/http';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
import { PostcodeAPI } from '../../../../helpers/API/postcode.api';
@Component({
  selector: 'find-address',
  templateUrl: './find-address.component.html'
})
export class FindAddressComponent {

  model: { postcode?: string, addressLineOne?: string } = {}

  postcodeHasErrors: boolean = false;
  postcodeErrorText: string = '';

  @Output() public onFindAddress = new EventEmitter<{ input: string, addresses: string[] | undefined }>();


  constructor(public applicationService: ApplicationService, private httpClient: HttpClient) {

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
    let addresses: string[] = [];
    let postcodeApi = new PostcodeAPI(this.httpClient);
    await postcodeApi.getAddressUsingPostcodeOnDPA(this.model.postcode ?? '').then((value) => {
      addresses = value;
    });
    return addresses ?? [];
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.postcodeHasErrors && showError ? errorMessage : undefined;
  }

}
