import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'too-many-address',
  templateUrl: './too-many-address.component.html'
})
export class TooManyAddressComponent {

  @Input() public address?: string;

  @Output() public onSearchAgain = new EventEmitter();
  @Output() public onEnterManualAddress = new EventEmitter();

  constructor(public applicationService: ApplicationService) {
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
