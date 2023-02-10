import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from '../../../../helpers/base-form.component';
import { BlockRegistrationService } from '../../../../services/block-registration.service';

@Component({
  selector: 'hse-accountable-person',
  templateUrl: './accountable-person.component.html',
  styleUrls: ['./accountable-person.component.scss']
})
export class AccountablePersonComponent extends BaseFormComponent {
  static route: string = 'accountable-person';

  nextScreenRoute: string = '';
  building: { accountablePerson?: string } = {}
  accountablePersonHasErrors = false;

  constructor(router: Router, private blockRegistrationService: BlockRegistrationService) {
    super(router);
  }

  canContinue(): boolean {
    this.accountablePersonHasErrors = !this.building.accountablePerson;
    if (!this.accountablePersonHasErrors) this.nextScreenRoute = this.building.accountablePerson ?? '';
    return !this.accountablePersonHasErrors;
  }

}
