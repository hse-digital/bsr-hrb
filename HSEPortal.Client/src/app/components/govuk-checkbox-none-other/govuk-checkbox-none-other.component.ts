import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GovukCheckboxComponent } from 'hse-angular';
import { CheckboxOptionComponent } from '../govuk-checkbox-none/checkbox-option.component';

@Component({
  selector: 'govuk-checkbox-none-other',
  templateUrl: './govuk-checkbox-none-other.component.html'
})
export class GovukCheckboxNoneOtherComponent {

  @Output() onKeyupEnter = new EventEmitter();
  @Input() title?: string;
  @Input() titleClass?: string;
  @Input() fieldsetClass?: string;
  @Input() isPageHeading: boolean = false;
  @Input() hint?: string;
  @Input() id!: string;
  @Input() checkboxGroupId!: string;
  @Input() noCheckboxSelectedErrorText?: string;
  @Input() otherValueErrorText?: string;
  @Input() noneOptionText: string = "None of these";
  @Input() noneOptionValue: string = "none";
  @Input() otherOptionValue: string = "other";
  @Input() otherOptionText?: string;
  @Input() otherOptionLabel?: string;
  @Input() otherOptionHint?: string;

  @ContentChildren(CheckboxOptionComponent) public checkboxes?: QueryList<CheckboxOptionComponent>;

  @ViewChildren("checkbox") public checkboxElements?: QueryList<GovukCheckboxComponent>;
  @ViewChild("noneCheckbox") public noneCheckbox?: GovukCheckboxComponent;
  @ViewChild("otherCheckbox") public otherCheckbox?: GovukCheckboxComponent;

  modelValue: {
    checkBoxSelection?: string[],
    otherValue?: string,
  } = {
      checkBoxSelection: [],
      otherValue: ''
  }

  @Output() public modelChange = new EventEmitter<any>();

  @Input() get model() {
    return this.modelValue;
  }

  set model(value) {
    this.modelValue = value;
    this.modelChange.emit(this.modelValue);
  }

  noneOptionClicked() {
    this.model.checkBoxSelection = ["none"];
    this.model.otherValue = '';
    this.checkboxElements?.forEach(element => element.checked = false);
    this.otherCheckbox!.checked=false;
  }

  otherOptionClicked() {
    this.noneCheckbox!.checked = false;
  }
  optionClicked() {
    this.noneCheckbox!.checked = false;

  }
}
