import { Component } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { ApHelper } from "src/app/helpers/ap-helper";
import { ApplicationService } from "src/app/services/application.service";
import { PapDetailsComponent } from "../ap-details/pap-details.component";

@Component({
    template: `<ap-name [pap]=true [nextRoute]="nextRoute" />`
})
export class PapNameComponent implements CanActivate {
    static route: string = 'pap-name';
    static title: string = "PAP individual name - Register a high-rise building - GOV.UK";

    nextRoute = PapDetailsComponent.route;

    constructor(private applicationService: ApplicationService) { }

    canActivate(routeSnapshot: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
        return ApHelper.isApAvailable(routeSnapshot, this.applicationService);
    }
}
