import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'checkbox-option',
  template: '<ng-template><ng-content/></ng-template>'
})
export class CheckboxOptionComponent {
  @Input() public text?: string;
  @Input() public hint?: string;
  @Input() public value?: string;
  @Input() public id?: string;

  @ViewChild(TemplateRef)
  template!: TemplateRef<any>;
}
