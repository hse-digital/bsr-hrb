import { Component } from '@angular/core';
import { AccountablePersonModel, ApplicationService } from 'src/app/services/application.service';
import { PapNameService } from 'src/app/services/pap-name.service';

@Component({
  selector: 'accountable-person-summary',
  templateUrl: './accountable-person-summary.component.html'
})
export class AccountablePersonSummaryComponent {
  aps: AccountablePersonModel[] = [];

  constructor(private applicationService: ApplicationService, public papNameService: PapNameService) { }

  ngOnInit(): void {
    this.aps = this.applicationService.model.AccountablePersons;
  }
}
