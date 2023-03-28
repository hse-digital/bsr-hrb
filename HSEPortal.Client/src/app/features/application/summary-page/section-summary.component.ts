import { Component, Input } from '@angular/core';
import { SectionModel } from 'src/app/services/application.service';

@Component({
  selector: 'section-summary',
  templateUrl: './section-summary.component.html'
})
export class SectionSummaryComponent {
  @Input() section!: SectionModel;
  @Input() hasMoreSections = false;
}
