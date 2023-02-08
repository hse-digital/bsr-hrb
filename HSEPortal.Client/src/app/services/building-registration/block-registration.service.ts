import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from "rxjs";

@Injectable()
export class BlockRegistrationService {

  blockRegistrationModel: BlockRegistrationModel = {};

  constructor(private httpClient: HttpClient) { }

  setNumberBlockBuilding(numberBlocksBuilding: string) {
    this.blockRegistrationModel.numberBlocksBuilding = numberBlocksBuilding;
  }

  setFloorsAbove(floorsAbove: number) {
    this.blockRegistrationModel.floorsAbove = floorsAbove;
  }

  setHeight(height: number) {
    this.blockRegistrationModel.height = height;
  }

  setPeopleLivingInBuilding(peopleLivingInBuilding: any) {
    this.blockRegistrationModel.peopleLivingInBuilding = peopleLivingInBuilding;
  }

  setResidentialUnits(residentialUnits: number) {
    this.blockRegistrationModel.residentialUnits = residentialUnits;
  }

  clearBlockRegistrationModel() {
    this.blockRegistrationModel = {};
  }

  async registerNewBlock(): Promise<void> {
    // await firstValueFrom(this.httpClient.post('TO-DO', this.blockRegistrationModel));
  }
}

export class BlockRegistrationModel {
  numberBlocksBuilding?: string;
  floorsAbove?: number;
  height?: number;
  peopleLivingInBuilding?: any;
  residentialUnits?: number;
  yearCompletition?: any;
  completitionCertificateIssuer?: any;
  completitionCertificateReference?: any;
  address?: string;
}

