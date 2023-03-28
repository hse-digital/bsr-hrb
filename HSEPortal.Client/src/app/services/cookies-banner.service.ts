import { Injectable } from '@angular/core';

@Injectable()
export class CookiesBannerService {

  cookiesModel!: { showCookies: boolean, cookiesAccepted: boolean };

  cookieKey: string = "nonEsentialCookies";
  cookieExpiresDays = 365;

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
    this.setCookie("true");
  }

  rejectCookies() {
    if (!this.cookiesModel) this.initCookiesModel();
    this.cookiesModel.showCookies = this.cookiesModel.cookiesAccepted = false;
    this.setCookie("false");
  }

  resetCookies() {
    Cookies.set(this.cookieKey, "", -1);
    this.initCookiesModel();
  }

  private initCookiesModel() {
    let model = this.getCookie(this.cookieKey);
    this.cookiesModel = model ? model
      : { showCookies: true, cookiesAccepted: false };
  }

  private setCookie(value: string) {
    Cookies.set(this.cookieKey, value, this.cookieExpiresDays);
  }

  private getCookie(cookieKey: string) {
    let cookie = Cookies.get(cookieKey);
    if (cookie) {
      let value = cookie.substring(cookie.indexOf('=') + 1, cookie.length - 1);
      return {
        showCookies: false,
        cookiesAccepted: value === "true"
      };
    }
    return undefined;
  }
}

export class Cookies {

  static set(key: string, value: string, expiresDays?: number, path: string = "/") {
    let expires = expiresDays ? this.createExpiresValue(expiresDays) : "";
    this.add(key, value, expires, path);
  }

  static get(key: string): string | undefined {
    if (typeof document !== 'undefined') {
      return document.cookie.split(' ').find(x => x.trim().startsWith(`${key}=`)) ?? "";
    }

    return undefined;
  }

  private static add(key: string, value: string, expires?: string, path?: string) {
    if (typeof document !== 'undefined') {
      let newCookie = `${key}=${value}${expires ? "; expires=" + expires : ""}${path ? "; path=" + path : ""}`;
      document.cookie = newCookie;
    }
  }

  private static createExpiresValue(expiresDays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (expiresDays * 24 * 60 * 60 * 1000));
    return `expires=${d.toUTCString()}`;
  }
}
