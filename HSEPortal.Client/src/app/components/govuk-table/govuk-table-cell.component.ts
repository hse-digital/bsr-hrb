import { AfterViewInit, ChangeDetectorRef, Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'govuk-table-cell',
  template: "<ng-template><td class='govuk-table__cell'><ng-content/></td></ng-template>"
})
export class GovukTableCellComponent implements AfterViewInit {
  @ViewChild(TemplateRef)
  template!: TemplateRef<any>;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    
  }

  public ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
