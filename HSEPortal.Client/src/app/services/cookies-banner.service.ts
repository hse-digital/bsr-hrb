import { Injectable } from '@angular/core';
import { LocalStorage } from "src/app/helpers/local-storage";

@Injectable({
  providedIn: 'root'
})
export class CookiesBannerService {

  cookiesModel!: { showCookies: boolean, cookiesAccepted: boolean };

  constructor() {
    this.initCookiesModel();
  }

  getShowCookiesStatus() {
    if (!this.cookiesModel) this.initCookiesModel();
    return this.cookiesModel?.showCookies ?? true;
  }

  acceptCookies() {
    if (!this.cookiesModel) this.initCookiesModel();
    this.cookiesModel.showCookies = false;
    this.cookiesModel.cookiesAccepted = true;
    LocalStorage.setJSON("cookies", this.cookiesModel);
  }

  rejectCookies() {
    if (!this.cookiesModel) this.initCookiesModel();
    this.cookiesModel.showCookies = false;
    this.cookiesModel.cookiesAccepted = false;
    LocalStorage.setJSON("cookies", this.cookiesModel);
  }

  private initCookiesModel() {
    this.cookiesModel = LocalStorage.getJSON("cookies");
    if (!this.cookiesModel) {
      this.cookiesModel = { showCookies: true, cookiesAccepted: false };
      LocalStorage.setJSON("cookies", this.cookiesModel);
    }
  }
}
