import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from '../../../../helpers/base-form.component';
import { BuildingRegistrationService } from '../../../../services/building-registration.service';

@Component({
  selector: 'hse-other-accountable-person',
  templateUrl: './other-accountable-person.component.html'
})
export class OtherAccountablePersonComponent extends BaseFormComponent {
  static route: string = 'other-accountable-person';

  nextScreenRoute: string = '';
  otherAccountablePersonHasErrors = false;

  constructor(router: Router, public buildingRegistrationService: BuildingRegistrationService) {
    super(router);
  }

  canContinue(): boolean {
    this.otherAccountablePersonHasErrors = !this.buildingRegistrationService.model.OtherAccountablePerson;
    if (!this.otherAccountablePersonHasErrors) this.nextScreenRoute = this.buildingRegistrationService.model.OtherAccountablePerson ?? '';
    return !this.otherAccountablePersonHasErrors;
  }

}
