import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpClient: HttpClient) { }

  async SearchBuildingByPostcode(postcode: string): Promise<AddressResponseModel> {
    return await firstValueFrom(this.httpClient.get<AddressResponseModel>(`api/SearchBuildingByPostcode/${postcode}`));
  }

  async SearchPostalAddressByPostcode(postcode: string): Promise<AddressResponseModel> {
    return await firstValueFrom(this.httpClient.get<AddressResponseModel>(`api/SearchPostalAddressByPostcode/${postcode}`));
  }

  async SearchAddress(query: string): Promise<AddressResponseModel> {
    return await firstValueFrom(this.httpClient.get<AddressResponseModel>(`api/SearchAddress/${query}`));
  }
}

export class AddressResponseModel {
  Offset!: number;
  MaxResults!: number;
  TotalResults!: number;
  Results: AddressModel[] = [];
}

export class AddressModel {
  IsManual: boolean = false;
  UPRN?: string;
  USRN?: string;
  Address?: string;
  AddressLineTwo?: string;
  BuildingName?: string;
  Number?: string;
  Street?: string;
  Town?: string;
  AdministrativeArea?: string;
  Postcode?: string;
}