import { Component, Input } from '@angular/core';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { SectionModel } from 'src/app/services/application.service';

@Component({
  selector: 'section-summary',
  templateUrl: './section-summary.component.html'
})
export class SectionSummaryComponent {
  @Input() section!: SectionModel;
  @Input() hasMoreSections = false;
  
  areEqual(a?: string, b?: string) {
    return FieldValidations.AreEqual(a?.replaceAll(' ', ''), b?.replaceAll(' ', ''));
  }

}
