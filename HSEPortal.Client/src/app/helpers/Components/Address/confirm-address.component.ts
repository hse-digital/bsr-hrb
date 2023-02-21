import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'confirm-address',
  templateUrl: './confirm-address.component.html'
})
export class ConfirmAddressComponent {

  @Input() public selectedAddress?: string;

  @Output() public onAddressConfirmed = new EventEmitter<boolean | undefined>();
  @Output() public onSearchAgain = new EventEmitter();
  @Output() public onEnterManualAddress = new EventEmitter();

  constructor(public applicationService: ApplicationService, public navigationService: NavigationService) {
  }

  confirm() {
    this.onAddressConfirmed.emit(true);
  }

  searchAgain(event: any) {
    event.preventDefault();
    this.onSearchAgain.emit();
  }

  enterManualAddress(event: any) {
    event.preventDefault();
    this.onEnterManualAddress.emit();
  }

}
