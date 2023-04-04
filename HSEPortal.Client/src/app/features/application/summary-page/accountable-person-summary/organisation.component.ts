import { Component, Input } from '@angular/core';
import { SummaryComponent } from 'src/app/helpers/summary-helper';
import { AccountablePersonModel } from 'src/app/services/application.service';

@Component({
  selector: 'organisation-summary',
  templateUrl: './organisation.component.html'
})
export class OrganisationComponent extends SummaryComponent {
  @Input() override ap!: AccountablePersonModel;
  @Input() override apIndex!: number;
  @Input() override hasMoreAp = false;
}
