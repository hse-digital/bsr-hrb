import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KbiSectionModel } from "./application.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class KbiService {
  
  constructor(private httpClient: HttpClient) {
  }

  async startKbi(sectionModel: KbiSectionModel): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/SyncKbiStructureStart', sectionModel));
  }

  async syncFireEnergy(sectionModel: KbiSectionModel | undefined) {
    await firstValueFrom(this.httpClient.post('api/SyncKbiFireAndEnergy', sectionModel));
  }
}