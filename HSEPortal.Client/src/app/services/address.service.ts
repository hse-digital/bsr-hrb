import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpClient: HttpClient) { }

  async SearchBuildingByPostcode(postcode: string) {
    return await firstValueFrom(this.httpClient.get<any>(`api/SearchBuildingByPostcode/${postcode}`));
  }

  async SearchPostalAddressByPostcode(postcode: string) {
    return await firstValueFrom(this.httpClient.get<any>(`api/SearchPostalAddressByPostcode/${postcode}`));
  }

  async SearchAddress(query: string) {
    return await firstValueFrom(this.httpClient.get<any>(`api/SearchAddress/${query}`));
  }

}
