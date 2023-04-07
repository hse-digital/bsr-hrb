import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Cookies, CookiesBannerService } from 'src/app/services/cookies-banner.service';

@Component({
  selector: 'hse-cookies',
  templateUrl: './cookies.component.html'
})
export class CookiesComponent implements OnInit {
  public static route: string = "cookies";
  static title: string = "Cookies - Register a high-rise building - GOV.UK";

  cookieModel?: string;

  constructor(public cookiesBannerService: CookiesBannerService) { }

  async ngOnInit() {
    this.cookieModel = !this.cookiesBannerService.cookiesModel.showCookies
      ? String(this.cookiesBannerService.cookiesModel.cookiesAccepted)
      : undefined;
  }

  saveCookieSettings() {
    if (!!this.cookieModel) {
      Cookies.set(this.cookiesBannerService.cookieKey, "", -1);
      Cookies.set(this.cookiesBannerService.cookieKey, this.cookieModel, this.cookiesBannerService.cookieExpiresDays);
    }
  }
}
