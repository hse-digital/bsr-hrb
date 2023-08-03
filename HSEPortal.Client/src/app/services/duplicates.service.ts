import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressModel } from './address.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DuplicatesService {

  constructor(private httpClient: HttpClient) { }

  async GetRegisteredStructureBy(postcode: string): Promise<RegisteredStructureModel> {
    return await firstValueFrom(this.httpClient.get<RegisteredStructureModel>(`api/GetRegisteredStructureByPostcode/${postcode}`));
    //return {name: "name", height: "height", numFloors: "numFloors", papAddress: new AddressModel(), papName: "papName", residentialUnits: "residentialUnits", structureAddress: new AddressModel(), papIsOrganisation: true}
  }
}

export type RegisteredStructureModel = {
  name?: string,
  numFloors?: string,
  height?: string,
  residentialUnits?: string,
  structureAddress?: AddressModel,
  papName?: string,
  papAddress?: AddressModel,
  papIsOrganisation?: boolean;
}