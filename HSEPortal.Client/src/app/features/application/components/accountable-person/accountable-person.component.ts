import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from '../../../../helpers/base-form.component';
import { BuildingRegistrationService } from '../../../../services/building-registration.service';

@Component({
  selector: 'hse-accountable-person',
  templateUrl: './accountable-person.component.html'
})
export class AccountablePersonComponent extends BaseFormComponent {
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
