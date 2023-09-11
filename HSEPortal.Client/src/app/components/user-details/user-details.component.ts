import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/services/application.service';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent {
  @Input() public user?: User;
  @Input() public showRemoveAction: boolean = true;
  @Input() public showChangeAction: boolean = true;
  @Input() public showActions: boolean = true;

  @Output() public removeClicked = new EventEmitter();
  @Output() public changeClicked = new EventEmitter();
}
