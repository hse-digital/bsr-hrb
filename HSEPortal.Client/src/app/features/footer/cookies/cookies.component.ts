import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Cookies, CookiesService } from 'src/app/services/cookies-banner.service';

@Component({
  selector: 'hse-cookies',
  templateUrl: './cookies.component.html'
})
export class CookiesComponent implements OnInit {
  public static route: string = "cookies";
  static title: string = "Cookies - Register a high-rise building - GOV.UK";

  cookiesAccepted?: string;

  constructor(public cookiesService: CookiesService) { }

  async ngOnInit() {
    this.cookiesAccepted = !this.cookiesService.cookiesModel.showCookies
      ? String(this.cookiesService.cookiesModel.cookiesAccepted)
      : undefined;
  }

  saveCookieSettings() {
    if (this.cookiesAccepted == 'true') {
      this.cookiesService.acceptCookies();
    } else if (this.cookiesAccepted == 'false') {
      this.cookiesService.rejectCookies();
    }
  }
}
