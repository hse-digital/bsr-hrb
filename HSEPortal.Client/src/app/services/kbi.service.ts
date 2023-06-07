import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KbiSectionModel } from "./application.service";

@Injectable()
export class KbiService {
  
  constructor(private httpClient: HttpClient) {
  }

  async startKbi(sectionModel: KbiSectionModel): Promise<void> {
    await this.httpClient.post('api/SyncKbiStructureStart', sectionModel);
  }

  async syncFireEnergy(sectionModel: KbiSectionModel | undefined) {
    await this.httpClient.post('api/SyncKbiFireAndEnergy', sectionModel);
  }
}