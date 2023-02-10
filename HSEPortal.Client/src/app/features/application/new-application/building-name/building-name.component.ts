import { Component } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  templateUrl: './building-name.component.html'
})
export class BuildingNameComponent extends BaseComponent {
  static route: string = "building-name";

  constructor(router: Router, activatedRoute: ActivatedRoute, public registrationService: ApplicationService) {
    super(router, registrationService, activatedRoute);
    console.log(super.getURLParam('id'))
  }

  nextScreenRoute: string = `/application/new/contact-name`;
  nameHasErrors: boolean = false;

  canContinue(): boolean {
    this.nameHasErrors = !this.applicationService.model.BuildingName;
    return !this.nameHasErrors;
  }
}
