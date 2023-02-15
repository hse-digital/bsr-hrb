import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { LocalStorage } from "src/app/helpers/local-storage";

@Injectable()
export class ApplicationService {
  private _localStorage: LocalStorage = new LocalStorage();

  model: BuildingRegistrationModel = {};
  currentBlock: BlockModel = {};
  currentAccountablePerson: any = {};

  constructor(private httpClient: HttpClient) {
    this.model = this._localStorage.getJSON('HSE_MODEL');
    if (!this.model) this.model = {};
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

  initializeNewBlock(): string {
    this.currentBlock = {};
    console.log('model', this.model);
    let length = this.model.Blocks?.push(this.currentBlock) ?? 1;
    let newId = this.generateNewBlockId(length);
    this.setNewBlockId(newId);
    return newId;
  }

  private generateNewBlockId(index: number) {
    return `block-${index ?? 1}`
  }

  private setNewBlockId(newId: string) {
    this.currentBlock.Id = newId;
    let block = this.model.Blocks?.at(-1);
    if (block) block.Id = newId;
  }

  initializeNewAccountablePerson() {
    this.currentAccountablePerson = <AccountablePersonModel>{};
    let length = this.model.AccountablePersons?.push(this.currentAccountablePerson) ?? 1;
    this.currentAccountablePerson.Id = length;
    let accountablePerson = this.model.AccountablePersons?.at(-1);
    if (accountablePerson) accountablePerson.Id = length.toString();
    return length;
  }

  castDownAccountablePersonTo<T>() {
    this.currentAccountablePerson = <T>this.currentAccountablePerson;
  }

  async sendVerificationEmail(emailAddress: string): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/SendVerificationEmail', { "EmailAddress": emailAddress }));
  }

  async validateOTPToken(otpToken: string, emailAddress: string): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/ValidateOTPToken', {
      "OTPToken": otpToken,
      "EmailAddress": emailAddress
    }));
  }

  async isApplicationNumberValid(emailAddress: string, applicationNumber: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpClient.get(`api/ValidateApplicationNumber/${applicationNumber}/${emailAddress}`));
      return true;
    } catch {
      return false;
    }
  }

  async continueApplication(applicationNumber: string, emailAddress: string, otpToken: string): Promise<void> {
    var application = await firstValueFrom(this.httpClient.get<BuildingRegistrationModel>(`api/GetApplication/${applicationNumber}/${emailAddress}/${otpToken}`));
    this.model = application;
  }

  async registerNewBuildingApplication(): Promise<void> {
    this.model = await firstValueFrom(this.httpClient.post<BuildingRegistrationModel>('api/NewBuildingApplication', this.model));

    this.currentBlock = {};
    this.currentAccountablePerson = {};
    this._localStorage.setJSON('HSE_MODEL', this.model)
  }

}

export class BuildingRegistrationModel {
  id?: string;
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

export abstract class AccountablePersonModel {
  Id?: string;
  Type?: string;
  IsPrincipal?: boolean;
}

export class OrganisationAccountablePersonModel extends AccountablePersonModel {
  Name?: string;
  OrganisationType?: string;
  AddressLineOne?: string;
  AddressLineTwo?: string;
  TownOrCity?: string;
  Postcode?: string;
}

export class IndividualAccountablePersonModel extends AccountablePersonModel {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  PhoneNumber?: string;
}
