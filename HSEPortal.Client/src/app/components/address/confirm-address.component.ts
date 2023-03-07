import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SectionHelper } from 'src/app/helpers/section-name-helper';
import { AddressModel } from 'src/app/services/address.service';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'confirm-address',
  templateUrl: './confirm-address.component.html'
})
export class ConfirmAddressComponent {

  @Input() address!: AddressModel;
  @Input() addressName?: string;
  @Input() selfAddress = false;
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

  getSectionName() {
    if (this.applicationService.model.NumberOfSections == 'one')
      return this.applicationService.model.BuildingName;

    return this.applicationService.currentSection.Name ?? SectionHelper.getSectionCardinalName(this.applicationService._currentSectionIndex);
  }

  getTitle() {
    return this.selfAddress ? 'Confirm your address' : `Confirm the address of ${this.addressName}`;
  }
}
