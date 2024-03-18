import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { LocalStorage } from "src/app/helpers/local-storage";

@Injectable({ providedIn: 'root' })
export class BacService {

  constructor(private httpClient: HttpClient) { }

  async canAccess(): Promise<boolean> {
    var isProtected = await firstValueFrom(this.httpClient.post('api/IsFeatureProtected', { 'Name': 'Bac' }));
    if (!isProtected) return true;

    var storedPassword = LocalStorage.getJSON("BAC_SERVICE")?.Password;
    return storedPassword != undefined;
  }

  async checkPassword(password?: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpClient.post('api/ValidateFeaturePassword', { 'Password': password, 'Name': 'Bac' }));
      return true;
    } catch (_) {
      return false;
    }
  }
}