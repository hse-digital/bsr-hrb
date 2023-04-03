import { Component } from '@angular/core';
import { AccountablePersonModel, ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'accountable-person-summary',
  templateUrl: './accountable-person-summary.component.html'
})
export class AccountablePersonSummaryComponent {

  aps: AccountablePersonModel[] = [];

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.aps = this.applicationService.model.AccountablePersons;
  }

  getPrincipalAccountablePersonName() {
    return `${this.aps[0].IsPrincipal == 'no' ? this.aps[0].FirstName : this.applicationService.model.ContactFirstName} ${this.aps[0].IsPrincipal == 'no' ? this.aps[0].LastName : this.applicationService.model.ContactLastName}`;
  }
}
