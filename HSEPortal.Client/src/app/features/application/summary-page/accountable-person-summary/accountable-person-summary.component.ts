import { Component } from '@angular/core';
import { AccountablePersonModel, ApplicationService } from 'src/app/services/application.service';
import { AccountabilityArea } from 'src/app/components/pap-accountability/pap-accountability.component';

@Component({
  selector: 'accountable-person-summary',
  templateUrl: './accountable-person-summary.component.html'
})
export class AccountablePersonSummaryComponent {
  aps: AccountablePersonModel[] = [];

  summaryArea = AccountabilityArea.Summary;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.aps = this.applicationService.model.AccountablePersons;
  }
}
