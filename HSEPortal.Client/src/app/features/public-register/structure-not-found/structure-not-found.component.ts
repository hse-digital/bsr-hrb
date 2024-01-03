import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  templateUrl: './structure-not-found.component.html'
})
export class StructureNotFoundComponent {
  public static title: string = 'Structure not found - Register a high-rise building - GOV.UK';
  public static route: string = 'not-found';

  postcode: string = '';

  constructor(private router: Router) {
    this.postcode = this.router.getCurrentNavigation()?.extras.state?.["postcode"];
  }
}