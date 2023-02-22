import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'select-address',
  templateUrl: './select-address.component.html'
})
export class SelectAddressComponent {

  addressHasErrors = false;
  selectedAddress?: string;

  @Input() address?: string;
  @Input() addresses?: string[];
  @Output() public onSelectAddress = new EventEmitter<string | undefined>();

  @Output() public onSearchAgain = new EventEmitter();
  @Output() public onEnterManualAddress = new EventEmitter();

  constructor(public applicationService: ApplicationService, public navigationService: NavigationService) {
  }

  continue() {
    this.addressHasErrors = !this.selectedAddress;
    if (!this.addressHasErrors) this.onSelectAddress.emit(this.selectedAddress);
  }

  searchAgain(event: any) {
    event.preventDefault();
    this.onSearchAgain.emit();
  }

  enterManualAddress(event: any) {
    event.preventDefault();
    this.onEnterManualAddress.emit();
  }

  getErrorDescription(showError: boolean, errorMessage: string): string | undefined {
    return this.addressHasErrors && showError ? errorMessage : undefined;
  }

  get numberOfAddresses(): number | undefined {
    return this.addresses?.length;
  }
}
