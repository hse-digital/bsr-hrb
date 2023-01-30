import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/helpers/base-form.component';

@Component({
  selector: 'hse-building-name',
  templateUrl: './building-name.component.html'
})
export class BuildingNameComponent extends BaseFormComponent {

  constructor(router: Router) {
    super(router);
  }

  nextScreenRoute: string = '/building-registration/contact-details/name';
  nameHasErrors: boolean = false;
  building: { name?: string } = {}

  canContinue(): boolean {
    this.nameHasErrors = !this.building.name;
    return !this.nameHasErrors;
  }
}
