import { Component, Input } from '@angular/core';
import { KbiSummaryComponent } from '../kbi-summary.component';
import { Staircases, ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'staircases-summary',
  templateUrl: './staircases-summary.component.html'
})
export class StaircasesSummaryComponent extends KbiSummaryComponent {

  @Input() staircases: Staircases = {};

  constructor(applicationService: ApplicationService) {
    super(applicationService)
  }

}
