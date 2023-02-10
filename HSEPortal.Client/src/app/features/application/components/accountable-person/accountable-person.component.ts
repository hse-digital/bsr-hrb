import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'hse-accountable-person',
  templateUrl: './accountable-person.component.html'
})
export class AccountablePersonComponent extends BaseComponent {
  static route: string = 'accountable-person';

  nextScreenRoute: string = '';
  accountablePersonHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService) {
    super(router, applicationService);
  }

  canContinue(): boolean {
    this.accountablePersonHasErrors = !this.applicationService.model.AccountablePerson;
    if (!this.accountablePersonHasErrors) this.nextScreenRoute = this.applicationService.model.AccountablePerson ?? '';
    return !this.accountablePersonHasErrors;
  }

}
