import { Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GovukCheckboxComponent } from 'hse-angular';

@Component({
  selector: 'accountability',
  templateUrl: './accountability.component.html',
  styleUrls: ['./areas-accountability.component.scss']
})
export class AccountabilityComponent {
  @Output() onKeyupEnter = new EventEmitter();
  @Input() title?: string;
  @Input() hint?: string;
  @Input() id!: string;
  @Input() errorText?: string;

  @ViewChildren("checkbox") public checkboxElements?: QueryList<GovukCheckboxComponent>;
  @ViewChild("noneCheckbox") public noneCheckbox?: GovukCheckboxComponent;

  radioModel: string[] = [];

  @Output() public modelChange = new EventEmitter<any>();
  @Input() get model() {
    return this.radioModel;
  }

  set model(value) {
    this.radioModel = value;
    this.modelChange.emit(this.radioModel);
  }

  noneOptionClicked() {
    this.model = ['none'];
    this.checkboxElements?.forEach(element => element.checked = false);
  }

  optionClicked() {
    this.noneCheckbox!.checked = false;
  }

}
