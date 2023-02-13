import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ApplicationService {
  model: BuildingRegistrationModel = {};
  currentBlock?: any = {};

  constructor(private httpClient: HttpClient) {
    var localStorageModel = localStorage.getItem("HSE_MODEL");
    if (localStorageModel) {
      this.model = JSON.parse(atob(localStorageModel));
    }
  }

  newApplication() {
    this.model = {};
    localStorage.removeItem("HSE_MODEL");
    this.model.Blocks = [];
  }

  async registerNewBuildingApplication(): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/NewBuildingApplication', this.model));
  }

  updateLocalStorage() {
    localStorage.setItem("HSE_MODEL", btoa(JSON.stringify(this.model)));
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
  NumberBlocksBuilding?: string;
  Blocks?: {
    Id?: string;
    Name?: string;
    FloorsAbove?: number;
    Height?: number;
    PeopleLivingInBuilding?: any;
    ResidentialUnits?: number;
    YearCompletition?: any;
    CompletitionCertificateIssuer?: any;
    CompletitionCertificateReference?: any;
    Address?: string;
    AnotherBlock?: string;
  }[];
}
