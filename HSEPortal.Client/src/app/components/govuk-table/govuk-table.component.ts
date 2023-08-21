import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { GovukTableColComponent } from './govuk-table-col.component';
import { GovukTableRowComponent } from './govuk-table-row.component';

@Component({
  selector: 'govuk-table',
  templateUrl: './govuk-table.component.html'
})
export class GovukTableComponent implements AfterViewInit {
  @ContentChildren(GovukTableColComponent)
  public columns!: QueryList<GovukTableColComponent>;
  @ContentChildren(GovukTableRowComponent)
  public rows!: QueryList<GovukTableRowComponent>;

  @Input() public firstColumnWidth?: string = "40%";
  
  constructor(private changeDetectorRef: ChangeDetectorRef) {
    
  }

  public ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

}
