import { Injectable } from '@angular/core';
import { LocalStorage } from "src/app/helpers/local-storage";

@Injectable({
  providedIn: 'root'
})
export class CookiesBannerService {

  cookiesModel!: { showCookies: boolean, cookiesAccepted: boolean };
  private Cookies: Cookies;

  cookieKey: string = "nonEsentialCookies";
  cookieExpiresDays = 365;

  constructor() {
    this.Cookies = new Cookies();
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
    this.cookiesModel.showCookies = false;
    this.cookiesModel.cookiesAccepted = false;
    this.setCookie("false");
  }

  private initCookiesModel() {
    this.cookiesModel = this.parseCookie("nonEsentialCookies");
    if (!this.cookiesModel) {
      this.cookiesModel = { showCookies: true, cookiesAccepted: false };
    }
  }

  private setCookie(value: string) {
    this.Cookies.set(this.cookieKey, value, this.cookieExpiresDays);
  }

  private parseCookie(cookieKey: string) {
    let cookie: string = this.Cookies.get(cookieKey);
    if (cookie) {
      let value = cookie.substring(cookie.indexOf('=') + 1);
      this.cookiesModel = {
        showCookies: value === "true",
        cookiesAccepted: value === "true"
      };
    }
    return this.cookiesModel;
  }

  
}

export class Cookies {

  constructor() { }

  set(key: string, value: string, expiresDays?: number) {
    let expires = expiresDays ? this.createExpiresValue(expiresDays) : "";
    this.add(key, value, expires);
  }

  get(key: string): string {
    return document.cookie.split(' ').find(x => x.trim().startsWith(`${key}=`)) ?? "";
  }

  private add(key: string, value: string, expires?: string) {
    let newCookie = `${key}=${value}${expires ? "; expires=" + expires : ""}`;
    document.cookie = newCookie;
  }

  private createExpiresValue(expiresDays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (expiresDays * 24 * 60 * 60 * 1000));
    return `expires=${d.toUTCString()}`;
  }
}
