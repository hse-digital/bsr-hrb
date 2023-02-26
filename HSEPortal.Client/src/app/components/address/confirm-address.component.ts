import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddressModel } from 'src/app/services/address.service';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'confirm-address',
  templateUrl: './confirm-address.component.html'
})
export class ConfirmAddressComponent {

  @Input() address!: AddressModel;
  @Output() onAddressConfirmed = new EventEmitter<boolean | undefined>();
  @Output() onSearchAgain = new EventEmitter();
  @Output() onEnterManualAddress = new EventEmitter();

  constructor(public applicationService: ApplicationService, public navigationService: NavigationService) {
  }

  getAddressLineOne() {
    if (this.address.IsManual)
      return this.address.Address;

    var address = this.address.Address?.replace(this.address.Town!, '')!;
    address = address.replace(this.address?.Postcode!, '');

    return address.split(',').filter(x => x.trim().length > 0).join(', ');
  }

}
