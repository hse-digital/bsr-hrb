import { Component } from '@angular/core';

@Component({
  selector: 'hse-terms-conditions',
  templateUrl: './terms-conditions.component.html'
})
export class TermsConditionsComponent {
  public static route: string = "terms-conditions";
  static title: string = "Terms and conditions - Register a high-rise building - GOV.UK";

  constructor() { }
}
