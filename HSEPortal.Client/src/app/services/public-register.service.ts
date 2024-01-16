import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { LocalStorage } from "../helpers/local-storage";
import { Inject, Injectable } from "@angular/core";

@Injectable()
export class PublicRegisterService {

  constructor(private httpClient: HttpClient) {

  }

  async canAccessPublicRegister(): Promise<boolean> {
    var isEnabled = await firstValueFrom(this.httpClient.get<boolean>('api/IsPublicRegisterProtectionEnabled'));
    var storedPassword = LocalStorage.getJSON('PublicRegister')?.Password;

    return !isEnabled || storedPassword;
  }

  async validatePublicRegisterPassword(password?: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpClient.get<boolean>('api/ValidatePublicRegisterPassword', { headers: { 'PublicRegisterPassword': password ?? '' } }));
      return true;
    } catch {
      return false;
    }
  }
}