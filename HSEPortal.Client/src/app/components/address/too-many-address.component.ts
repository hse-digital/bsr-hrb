import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'too-many-address',
  templateUrl: './too-many-address.component.html'
})
export class TooManyAddressComponent {

  @Input() searchModel!: { postcode?: string, addressLine1?: string };
  @Output() onSearchAgain = new EventEmitter();
  @Output() onEnterManualAddress = new EventEmitter();

  constructor(public applicationService: ApplicationService) {
  }
}
