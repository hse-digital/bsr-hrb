import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KbiSectionModel } from "./application.service";

@Injectable()
export class KbiService {
  
  constructor(private httpClient: HttpClient) {
  }

  async startKbi(kbiModel: KbiSectionModel): Promise<void> {
    await this.httpClient.post('api/SyncKbiStructureStart', kbiModel);
  }

}