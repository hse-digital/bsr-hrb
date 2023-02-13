import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ApplicationService {
  model: BuildingRegistrationModel = {};
  currentBlock: BlockModel = {};
  currentAccountablePerson: AccountablePersonModel = {};

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
    this.model.AccountablePersons = [];
  }

  async sendVerificationEmail(): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/SendVerificationEmail', { "EmailAddress": this.model.ContactEmailAddress }));
  }

  async validateOTPToken(otpToken: string): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/ValidateOTPToken', { 
      "OTPToken": otpToken,
      "EmailAddress": this.model.ContactEmailAddress 
    }));
  }

  async registerNewBuildingApplication(): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/NewBuildingApplication', this.model));
  }

  updateLocalStorage() {
    this.updateCurrentBlockOnModel();
    this.updateCurrentAccountablePersonOnModel();
    localStorage.setItem("HSE_MODEL", btoa(JSON.stringify(this.model)));
  }

  updateCurrentBlockOnModel() {
    let block = this.model.Blocks?.find(x => x.Id === this.currentBlock.Id)
    if (block) block = this.currentBlock;
  }

  updateCurrentAccountablePersonOnModel() {
    let accountablePerson = this.model.AccountablePersons?.find(x => x.Id === this.currentAccountablePerson.Id)
    if (accountablePerson) accountablePerson = this.currentAccountablePerson;
  }
}

export class BuildingRegistrationModel {
  BuildingName?: string;
  ContactFirstName?: string;
  ContactLastName?: string;
  ContactPhoneNumber?: string;
  ContactEmailAddress?: string;
  NumberBlocksBuilding?: string;
  AccountablePersons?: AccountablePersonModel[];
  Blocks?: BlockModel[];
}

export class BlockModel {
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
}

export class AccountablePersonModel {
  Id?: string;
  Type?: string;
  IsPrincipalAP?: boolean;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  PhoneNumber?: string;
}
