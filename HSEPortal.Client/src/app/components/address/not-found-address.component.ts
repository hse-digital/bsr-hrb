import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'not-found-address',
  templateUrl: './not-found-address.component.html'
})
export class NotFoundAddressComponent {

  @Input() searchModel: { postcode?: string, addressLine1?: string } = {};
  @Input() addressName!: string;
  @Input() selfAddress = false;
  @Output() onSearchAgain = new EventEmitter();
  @Output() onEnterManualAddress = new EventEmitter();

  constructor(public applicationService: ApplicationService) {
  }

}
