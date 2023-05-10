import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GovukCheckboxComponent } from 'hse-angular';
import { CheckboxOptionComponent } from './checkbox-option.component';

@Component({
  selector: 'govuk-checkbox-none',
  templateUrl: './govuk-checkbox-none.component.html'
})
export class GovukCheckboxNoneComponent {

  @Output() onKeyupEnter = new EventEmitter();
  @Input() title?: string;
  @Input() hint?: string;
  @Input() id!: string;
  @Input() checkboxGroupId!: string;
  @Input() errorText?: string;
  @Input() noneOptionText: string = "None of these";
  @Input() noneOptionValue: string = "none";

  @ContentChildren(CheckboxOptionComponent) public checkboxes?: QueryList<CheckboxOptionComponent>;

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
