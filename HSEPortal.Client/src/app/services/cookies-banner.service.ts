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

    if (typeof window !== 'undefined') {
      (<any>window).clarity('consent');
    }
  }

  rejectCookies() {
    if (!this.cookiesModel) this.initCookiesModel();
    this.cookiesModel.showCookies = this.cookiesModel.cookiesAccepted = false;
    this.setCookie("false");

    Cookies.set("_clsk", "", -1);
    Cookies.set("_ga_Q39686J738", "", -1);
    Cookies.set("_ga", "", -1);
    Cookies.set("_clck", "", -1);
    Cookies.set("MUID", "", -1);
    Cookies.set("CLID", "", -1);
    Cookies.set("ANONCHK", "", -1);

    if (typeof window !== 'undefined') {
      (<any>window).clarity('stop');
    }
  }

  resetCookies() {
    Cookies.set(this.cookieKey, "", -1);
    this.initCookiesModel();
  }

  private initCookiesModel() {
    let model = this.getCookieModel(this.cookieKey);
    this.cookiesModel = model ? model
      : { showCookies: true, cookiesAccepted: false };
  }

  private setCookie(value: string) {
    Cookies.set(this.cookieKey, value, this.cookieExpiresDays);
  }

  private getCookieModel(cookieKey: string) {
    let cookie = Cookies.get(cookieKey);
    if (cookie) {
      let value = cookie.replace(';', '').substring(cookie.indexOf('=') + 1);
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
