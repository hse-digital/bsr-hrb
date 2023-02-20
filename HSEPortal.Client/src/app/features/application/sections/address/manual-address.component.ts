import { Component, EventEmitter, Output } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { PostcodeValidator } from 'src/app/helpers/validators/postcode-validator';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'manual-address',
  templateUrl: './manual-address.component.html'
})
export class ManualAddressComponent {

  @Output() public onSearchAgain = new EventEmitter();
  @Output() public onManualAddress =
    new EventEmitter<{ AddressLineOne?: string, AddressLineTwo?: string, TownOrCity?: string, Postcode?: string }>();

  hasErrors = false;
  errors = {
    lineOneHasErrors: false,
    townOrCityHasErrors: false,
    postcode: { hasErrors: false, errorText: '' },
  }

  model: { AddressLineOne?: string, AddressLineTwo?: string, TownOrCity?: string, Postcode?: string } = {}

  constructor(private httpClient: HttpClient, public applicationService: ApplicationService) {

  }

  async canContinue() {
    await !this.validateAndContinue();
    if (!this.hasErrors) {
      this.onManualAddress.emit(this.model);
    }
  }

  private async validateAndContinue() {
    this.errors.lineOneHasErrors = !this.model.AddressLineOne;
    this.errors.townOrCityHasErrors = !this.model.TownOrCity;
    await this.validatePostcode();
    this.hasErrors = this.errors.lineOneHasErrors || this.errors.townOrCityHasErrors || this.errors.postcode.hasErrors;
    return !this.hasErrors;
  }

  async validatePostcode() {
    let postcode = this.model.Postcode;
    this.errors.postcode.hasErrors = true;
    if (!postcode) {
      this.errors.postcode.errorText = 'Enter a postcode';
    } else if (!(await this.isPostcodeValid(postcode))) {
      this.errors.postcode.errorText = 'Enter a real postcode, like ‘EC3A 8BF’.';
    } else {
      this.errors.postcode.hasErrors = false;
    }
  }

  async isPostcodeValid(postcode: string): Promise<boolean> {
    return await new PostcodeValidator(this.httpClient).isValid(postcode).then((value: boolean) => {
      return value
    });
  }

  searchAgain(event: any) {
    event.preventDefault();
    this.onSearchAgain.emit();
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.hasErrors && showError ? errorMessage : undefined;
  }

}
