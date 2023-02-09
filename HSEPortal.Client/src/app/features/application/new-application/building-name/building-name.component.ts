import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/helpers/base-form.component';
import { BuildingRegistrationService } from 'src/app/services/building-registration.service';

@Component({
  templateUrl: './building-name.component.html'
})
export class BuildingNameComponent extends BaseFormComponent {
  static route: string = "building-name";

  constructor(router: Router, public registrationService: BuildingRegistrationService) {
    super(router);
  }

  nextScreenRoute: string = `/application/new/contact-name`;
  nameHasErrors: boolean = false;

  canContinue(): boolean {
    this.nameHasErrors = !this.registrationService.model.BuildingName;
    return !this.nameHasErrors;
  }
}
