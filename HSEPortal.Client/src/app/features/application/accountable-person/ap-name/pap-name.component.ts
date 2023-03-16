import { Component } from "@angular/core";
import { PapDetailsComponent } from "../ap-details/pap-details.component";

@Component({
  template: `<ap-name [pap]=true [nextRoute]="nextRoute" />`
})
export class PapNameComponent {
  static route: string = 'pap-name';
  static title: string = "PAP individual name - Register a high-rise building - GOV.UK";

  nextRoute = PapDetailsComponent.route;
}
