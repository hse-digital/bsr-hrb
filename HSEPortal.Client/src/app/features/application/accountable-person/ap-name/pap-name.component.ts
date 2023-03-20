import { Component } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { ApplicationService } from "src/app/services/application.service";
import { PapDetailsComponent } from "../ap-details/pap-details.component";

@Component({
  template: `<ap-name [pap]=true [nextRoute]="nextRoute" />`
})
export class PapNameComponent implements CanActivate {
  static route: string = 'pap-name';

  nextRoute = PapDetailsComponent.route;

  constructor(private applicationService: ApplicationService) { }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return !!this.applicationService.currentAccountablePerson.IsPrincipal && this.applicationService.currentAccountablePerson.IsPrincipal == "no"
      && !!this.applicationService.currentAccountablePerson.Address;
  }
}
