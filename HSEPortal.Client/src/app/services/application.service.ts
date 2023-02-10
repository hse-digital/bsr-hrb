import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ApplicationService {
  model: BuildingRegistrationModel = {};

  constructor(private httpClient: HttpClient) { }

  async registerNewBuildingApplication(): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/NewBuildingApplication', this.model));
  }
}

export class BuildingRegistrationModel {
  BuildingName?: string;
  ContactFirstName?: string;
  ContactLastName?: string;
  ContactPhoneNumber?: string;
  ContactEmailAddress?: string;
  AccountablePerson?: string;
  OtherAccountablePerson?: string;
}
