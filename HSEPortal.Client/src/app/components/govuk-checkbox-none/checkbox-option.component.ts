import { Component, Input } from '@angular/core';

@Component({
  selector: 'checkbox-option',
  template: ''
})
export class CheckboxOptionComponent {
  @Input() public text?: string;
  @Input() public value?: string;
  @Input() public id?: string;
}
