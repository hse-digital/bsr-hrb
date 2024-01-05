import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  templateUrl: './structure-details.component.html'
})
export class StructureDetailsComponent {
  public static title: string = 'Structure information - Register a high-rise building - GOV.UK';
  public static route: string = 'structure-information';

  result?: any;

  constructor(private router: Router) {
    this.result = this.router.getCurrentNavigation()?.extras.state?.["result"];
  }
}