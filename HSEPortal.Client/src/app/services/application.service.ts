import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { LocalStorage } from "src/app/helpers/local-storage";

@Injectable()
export class ApplicationService {
  private _localStorage: LocalStorage = new LocalStorage();

  model: BuildingRegistrationModel = {};
  currentBlock: BlockModel = {};
  currentAccountablePerson: AccountablePersonModel = {};

  constructor(private httpClient: HttpClient) {
    this.model = this._localStorage.getJSON('HSE_MODEL');
  }

  newApplication() {
    this._localStorage.remove('HSE_MODEL');
    this.model = {};
    this.model.Blocks = [];
    this.model.AccountablePersons = [];
  }

  updateLocalStorage() {
    this.updateCurrentBlockOnModel();
    this.updateCurrentAccountablePersonOnModel();
    this._localStorage.setJSON('HSE_MODEL', this.model)
  }

  private updateCurrentBlockOnModel() {
    let block = this.model.Blocks?.find(x => x.Id === this.currentBlock.Id)
    if (block) block = this.currentBlock;
  }

  private updateCurrentAccountablePersonOnModel() {
    let accountablePerson = this.model.AccountablePersons?.find(x => x.Id === this.currentAccountablePerson.Id)
    if (accountablePerson) accountablePerson = this.currentAccountablePerson;
  }

  initializeNewBlock(blockId: string) {
    this.currentBlock = { Id: blockId };
    this.model.Blocks?.push(this.currentBlock);
  }

  initializeNewAccountablePerson(accountablePersonId: string) {
    this.currentAccountablePerson = { Id: accountablePersonId };
    this.model.AccountablePersons?.push(this.currentAccountablePerson);
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

  async isApplicationNumberValid(emailAddress: string, applicationNumber: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpClient.post('api/ValidateApplicationNumber', {
        "ApplicationNumber": applicationNumber,
        "EmailAddress": emailAddress
      }));
      return true;
    } catch {
      return false;
    }
  }

  async registerNewBuildingApplication(): Promise<void> {
    this.model = await firstValueFrom(this.httpClient.post<BuildingRegistrationModel>('api/NewBuildingApplication', this.model));
  }

}

export class BuildingRegistrationModel {
  Id?: string;
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
  IsPrincipal?: boolean;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  PhoneNumber?: string;
}
