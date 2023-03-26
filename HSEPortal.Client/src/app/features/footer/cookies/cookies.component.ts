import { Component } from '@angular/core';

@Component({
  selector: 'hse-cookies',
  templateUrl: './cookies.component.html'
})
export class CookiesComponent {
  public static route: string = "cookies";
  static title: string = "Cookies - Register a high-rise building - GOV.UK";

  constructor() { }

  saveCookieSettings() {

  }
}
