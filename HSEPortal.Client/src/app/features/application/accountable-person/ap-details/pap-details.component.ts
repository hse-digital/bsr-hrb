import { Component } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { ApHelper } from "src/app/helpers/ap-helper";
import { ApplicationService } from "src/app/services/application.service";
import { PapAddressComponent } from "../ap-address/pap-address.component";

@Component({
    template: `<ap-details [pap]=true [nextRoute]="nextRoute" />`,
})
export class PapDetailsComponent implements CanActivate {
    static route: string = 'pap-details';
    static title: string = "PAP individual contact details - Register a high-rise building - GOV.UK";

    nextRoute = PapAddressComponent.route;

    constructor(private applicationService: ApplicationService) {

    }

    canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
        return ApHelper.isApAvailable(routeSnapshot, this.applicationService);
    }
}
