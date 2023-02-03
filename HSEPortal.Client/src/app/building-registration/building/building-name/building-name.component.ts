import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/helpers/base-form.component';
import { BuildingRegistrationService } from '../../../services/building-registration/building-registration.service';

@Component({
  selector: 'hse-building-name',
  templateUrl: './building-name.component.html'
})
export class BuildingNameComponent extends BaseFormComponent {

  constructor(router: Router, private buildingRegistrationService: BuildingRegistrationService) {
    super(router);
  }

  nextScreenRoute: string = '/building-registration/contact-details/name';
  nameHasErrors: boolean = false;
  building: { name?: string } = {}

  canContinue(): boolean {
    this.nameHasErrors = !this.building.name;
    return !this.nameHasErrors;
  }

  updateBuildingName(buildingName: string) {
    this.buildingRegistrationService.setBuildingName(buildingName);
  }
}
