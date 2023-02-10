import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { BuildingRegistrationService } from 'src/app/services/building-registration.service';

@Component({
  selector: 'hse-accountable-person',
  templateUrl: './accountable-person.component.html'
})
export class AccountablePersonComponent extends BaseComponent {
  static route: string = 'accountable-person';

  nextScreenRoute: string = '';
  accountablePersonHasErrors = false;

  constructor(router: Router, public buildingRegistrationService: BuildingRegistrationService) {
    super(router);
  }

  canContinue(): boolean {
    this.accountablePersonHasErrors = !this.buildingRegistrationService.model.AccountablePerson;
    if (!this.accountablePersonHasErrors) this.nextScreenRoute = this.buildingRegistrationService.model.AccountablePerson ?? '';
    return !this.accountablePersonHasErrors;
  }

}
