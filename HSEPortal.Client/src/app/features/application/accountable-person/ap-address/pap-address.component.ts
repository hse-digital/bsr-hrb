import { Component  } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { ApplicationService } from "src/app/services/application.service";

@Component({
    template: `<ap-address [pap]=true />`
})
export class PapAddressComponent implements CanActivate {
  static route: string = 'pap-address';

  constructor(private applicationService: ApplicationService) { }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    return (!!this.applicationService.currentAccountablePerson.IsPrincipal && this.applicationService.currentAccountablePerson.IsPrincipal == 'yes')
      || !!this.applicationService.currentAccountablePerson.OrganisationName;
  }
}
