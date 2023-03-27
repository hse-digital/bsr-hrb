import { Component } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate } from "@angular/router";
import { NotFoundComponent } from "src/app/components/not-found/not-found.component";
import { ApHelper } from "src/app/helpers/ap-helper";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { PapAddressComponent } from "../ap-address/pap-address.component";

@Component({
    template: `<ap-details [pap]=true [nextRoute]="nextRoute" />`,
})
export class PapDetailsComponent implements CanActivate {
    static route: string = 'pap-details';
    static title: string = "PAP individual contact details - Register a high-rise building - GOV.UK";

    nextRoute = PapAddressComponent.route;

    constructor(private applicationService: ApplicationService, private navigationService: NavigationService) {}

    canActivate(routeSnapshot: ActivatedRouteSnapshot) {
        if (!ApHelper.isApAvailable(routeSnapshot, this.applicationService)) {
            this.navigationService.navigate(NotFoundComponent.route);
            return false;
        }

        return true;
    }
}
