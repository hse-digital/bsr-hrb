import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'govuk-table-col',
  template: "<ng-template><th scope='col' [style.width]='width' class='govuk-table__header'><ng-content/></th></ng-template>"
})
export class GovukTableColComponent {
  @ViewChild(TemplateRef)
  template!: TemplateRef<any>;

  @Input() public width?: string;
}
