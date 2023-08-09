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
    return await firstValueFrom(this.httpClient.post<RegisteredStructureModel>("api/GetRegisteredStructure", {
      Postcode: postcode,
      AddressLineOne: "address"
    }));
  }
}

export type RegisteredStructureModel = {
  Name?: string;
  NumFloors?: string;
  Height?: string;
  ResidentialUnits?: string;
  StructureAddress?: AddressModel;
  PapName?: string;
  PapAddress?: AddressModel;
  PapIsOrganisation?: boolean;
  BuildingName?: string;
}