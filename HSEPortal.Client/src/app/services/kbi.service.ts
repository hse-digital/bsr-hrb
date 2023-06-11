import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApplicationService, KbiModel, KbiSectionModel } from "./application.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class KbiService {

  constructor(private httpClient: HttpClient, private applicationService: ApplicationService) {
  }

  async startKbi(sectionModel: KbiSectionModel): Promise<void> {
    await firstValueFrom(this.httpClient.post(`api/SyncKbiStructureStart/${this.applicationService.model.id}`, sectionModel));
  }

  async syncFireEnergy(sectionModel: KbiSectionModel | undefined) {
    await firstValueFrom(this.httpClient.post(`api/SyncKbiFireAndEnergy/${this.applicationService.model.id}`, sectionModel));
  }

  async syncStructureRoofStaircasesAndWalls(sectionModel: KbiSectionModel | undefined) {
    await firstValueFrom(this.httpClient.post(`api/SyncKbiStructureRoofStaircasesAndWalls/${this.applicationService.model.id}`, sectionModel));
  }

  async syncBuilding(sectionModel: KbiSectionModel | undefined) {
    await firstValueFrom(this.httpClient.post(`api/SyncKbiBuildingUse/${this.applicationService.model.id}`, sectionModel));
  }

  async syncConnectionsAndDeclaration(kbiModel: KbiModel) {
    await firstValueFrom(this.httpClient.post(`api/SyncKbiConnectionsAndDeclaration/${this.applicationService.model.id}`, kbiModel));
  }
}