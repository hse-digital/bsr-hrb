import { Component, ContentChildren, Input, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { GovukTableCellComponent } from './govuk-table-cell.component';

@Component({
  selector: 'govuk-table-row',
  templateUrl: './govuk-table-row.component.html'
})
export class GovukTableRowComponent {
  @Input() public header?: string;

  @ContentChildren(GovukTableCellComponent)
  public items!: QueryList<GovukTableCellComponent>;

  @ViewChild(TemplateRef)
  template!: TemplateRef<any>;
}
