import { Component } from "@angular/core";
import { PapAddressComponent } from "../ap-address/pap-address.component";

@Component({
    template: `<ap-details [pap]=true [nextRoute]="nextRoute" />`,
})
export class PapDetailsComponent {
    static route: string = 'pap-details';

    nextRoute = PapAddressComponent.route;
}