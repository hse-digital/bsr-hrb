import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'hse-other-accountable-person',
  templateUrl: './other-accountable-person.component.html'
})
export class OtherAccountablePersonComponent extends BaseComponent {
  static route: string = 'other-accountable-person';

  nextScreenRoute: string = '';
  otherAccountablePersonHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService) {
    super(router, applicationService);
  }

  canContinue(): boolean {
    this.otherAccountablePersonHasErrors = !this.applicationService.model.OtherAccountablePerson;
    if (!this.otherAccountablePersonHasErrors) this.nextScreenRoute = this.applicationService.model.OtherAccountablePerson ?? '';
    return !this.otherAccountablePersonHasErrors;
  }

}
