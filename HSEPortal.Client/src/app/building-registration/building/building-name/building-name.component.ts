import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/helpers/base-form.component';
import { BuildingRegistrationModel, BuildingRegistrationService } from '../../../services/building-registration/building-registration.service';

@Component({
  selector: 'hse-building-name',
  templateUrl: './building-name.component.html'
})
export class BuildingNameComponent extends BaseFormComponent {

  constructor(router: Router, public registrationService: BuildingRegistrationService) {
    super(router);
  }

  nextScreenRoute: string = '/building-registration/contact-details/name';
  nameHasErrors: boolean = false;

  canContinue(): boolean {
    this.nameHasErrors = !this.registrationService.model.BuildingName;
    return !this.nameHasErrors;
  }
}
