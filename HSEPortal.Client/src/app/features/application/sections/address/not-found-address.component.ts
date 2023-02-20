import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'not-found-address',
  templateUrl: './not-found-address.component.html'
})
export class NotFoundAddressComponent {

  @Input() public address?: string;

  @Output() public onSearchAgain = new EventEmitter();
  @Output() public onEnterManualAddress = new EventEmitter();

  constructor(public applicationService: ApplicationService, navigationService: NavigationService) {
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
