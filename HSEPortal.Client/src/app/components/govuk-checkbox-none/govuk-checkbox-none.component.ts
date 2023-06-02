import { AfterViewInit, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GovukCheckboxComponent } from 'hse-angular';
import { CheckboxOptionComponent } from './checkbox-option.component';

@Component({
  selector: 'govuk-checkbox-none',
  templateUrl: './govuk-checkbox-none.component.html'
})
export class GovukCheckboxNoneComponent implements AfterViewInit {

  @Output() onKeyupEnter = new EventEmitter();
  @Input() title?: string;
  @Input() titleClass?: string;
  @Input() fieldsetClass?: string;
  @Input() isPageHeading: boolean = false;
  @Input() hint?: string;
  @Input() id!: string;
  @Input() checkboxGroupId!: string;
  @Input() errorText?: string;
  @Input() noneOptionText: string = "None of these";
  @Input() unknownOptionText?: string;
  @Input() noneOptionValue: string = "none";
  @Input() unknownOptionValue: string = "unknown";

  @ContentChildren(CheckboxOptionComponent) public checkboxes?: QueryList<CheckboxOptionComponent>;

  @ViewChildren("checkbox") public checkboxElements?: QueryList<GovukCheckboxComponent>;
  @ViewChild("noneCheckbox") public noneCheckbox?: GovukCheckboxComponent;
  @ViewChild("unknownCheckbox") public unknownCheckbox?: GovukCheckboxComponent;

  radioModel: string[] = [];

  @Output() public modelChange = new EventEmitter<any>();
  @Input() get model() {
    return this.radioModel;
  }

  set model(value) {
    this.radioModel = value;
    this.modelChange.emit(this.radioModel);
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  noneOptionClicked() {
    this.model = ['none'];
    this.checkboxElements?.forEach(element => element.checked = false);
    if (!!this.unknownOptionText) {
      this.unknownCheckbox!.checked = false;
    }
  }

  unknownOptionClicked() {
    this.model = ['unknown'];
    this.checkboxElements?.forEach(element => element.checked = false);
    this.noneCheckbox!.checked = false;
  }

  optionClicked() {

    this.noneCheckbox!.checked = false;
    if (!!this.unknownOptionText) {
      this.unknownCheckbox!.checked = false;
    }

  }

  public ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
