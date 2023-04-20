import { Injectable } from '@angular/core';
import { LocalStorage } from '../helpers/local-storage';

@Injectable()
export class CookiesBannerService {

  cookiesModel!: CookiesBannerModel;

  cookieKey: string = "nonEsentialCookies";
  confirmBannerLocalStorageKey: string = "confirmBanner";
  cookieExpiresDays = 365;

  constructor() {
    this.initCookiesModel();
  }

  getShowCookiesStatus(): CookiesBannerModel {
    if (!this.cookiesModel) this.initCookiesModel();
    return this.cookiesModel;
  }

  acceptCookies(showConfirmBanner: boolean) {
    if (!this.cookiesModel) this.initCookiesModel();
    this.cookiesModel.showCookies = false;
    this.cookiesModel.cookiesAccepted = true;
    this.cookiesModel.showConfirmBanner = showConfirmBanner;
    this.updateCookieValue();
  }

  rejectCookies(showConfirmBanner: boolean) {
    if (!this.cookiesModel) this.initCookiesModel();
    this.cookiesModel.showCookies = this.cookiesModel.cookiesAccepted = false;
    this.cookiesModel.showConfirmBanner = showConfirmBanner;
    this.updateCookieValue();
  }

  removeConfirmationBanner() {
    if (!this.cookiesModel) this.initCookiesModel();
    this.cookiesModel.showConfirmBanner = false;
    this.updateCookieValue();
    LocalStorage.remove(this.confirmBannerLocalStorageKey);
  }

  updateCookieValue(){
    this.setCookie(this.cookiesModel.cookiesAccepted ? "true" : "false");
    let showConfirmBanner = this.cookiesModel.showConfirmBanner ? "showConfirm" : "hideConfirm";
    LocalStorage.setJSON(this.confirmBannerLocalStorageKey, showConfirmBanner);
  }

  resetCookies() {
    Cookies.set(this.cookieKey, "", -1);
    this.initCookiesModel();
  }

  refreshPage(){
    if (typeof window !== 'undefined') {
      window.location.href = window.location.href;
    }
  }

  private initCookiesModel() {
    let model = this.getCookieModel(this.cookieKey);
    this.cookiesModel = model ? model : new CookiesBannerModel();
  }

  private setCookie(value: string) {
    Cookies.set(this.cookieKey, value, this.cookieExpiresDays);
  }

  private getCookieModel(cookieKey: string): CookiesBannerModel | undefined {
    let cookie = Cookies.get(cookieKey);
    if (cookie) {
      let cookieValue = cookie.replace(';', '').substring(cookie.indexOf('=') + 1);
      let showConfirmBanner = LocalStorage.getJSON(this.confirmBannerLocalStorageKey);
      return {
        showCookies: false,
        showConfirmBanner: showConfirmBanner === "showConfirm",
        cookiesAccepted: cookieValue === "true"
      } as CookiesBannerModel;
    }
    return undefined;
  }
}

export class CookiesBannerModel {
  showCookies: boolean = true; 
  showConfirmBanner: boolean = false; 
  cookiesAccepted: boolean = false;
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
