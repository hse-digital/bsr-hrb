import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/helpers/base.component';
import { BuildingRegistrationService } from 'src/app/services/building-registration.service';

@Component({
  templateUrl: './building-name.component.html'
})
export class BuildingNameComponent extends BaseComponent {
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
