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

  async registerNewBuildingApplication(): Promise<void> {
    // await firstValueFrom(this.httpClient.post('TO-DO', this.blockRegistrationModel));
  }
}

class BlockRegistrationModel {
  public numberBlocksBuilding?: string;
}

