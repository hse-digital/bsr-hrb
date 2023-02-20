import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { LocalStorage } from "src/app/helpers/local-storage";

@Injectable()
export class ApplicationService {
  model: BuildingRegistrationModel;

  private _currentSectionIndex = 0;
  get currentSection(): SectionModel {
    return this.model.Sections[this._currentSectionIndex];
  }

  currentAccountablePerson: any = {};

  constructor(private httpClient: HttpClient) {
    this.model = LocalStorage.getJSON('HSE_MODEL') ?? {};
  }

  newApplication() {
    LocalStorage.remove('HSE_MODEL');
    this.model = new BuildingRegistrationModel();
  }

  updateLocalStorage() {
    LocalStorage.setJSON('HSE_MODEL', this.model)
  }

  isCurrentApplication(id: string): boolean {
    return this.model?.id !== undefined && this.model?.id == id;
  }

  startSectionsEdit() {
    this._currentSectionIndex = 0;
    this.model.Sections = [new SectionModel()];
  }

  startNewSection(): string {
    this.model.Sections.push(new SectionModel());
    this._currentSectionIndex = this.model.Sections.length - 1;

    return `section-${this._currentSectionIndex+1}`;
  }

  initializeNewAccountablePerson() {
    this.currentAccountablePerson = <AccountablePersonModel>{};
    let length = this.model.AccountablePersons?.push(this.currentAccountablePerson) ?? 1;
    this.currentAccountablePerson.Id = length;
    let accountablePerson = this.model.AccountablePersons?.at(-1);
    if (accountablePerson) accountablePerson.id = length.toString();

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

    LocalStorage.setJSON('HSE_MODEL', this.model)
  }

  async registerNewBuildingApplication(): Promise<void> {
    this.model = await firstValueFrom(this.httpClient.post<BuildingRegistrationModel>('api/NewBuildingApplication', this.model));
    LocalStorage.setJSON('HSE_MODEL', this.model)
  }

}

export class BuildingRegistrationModel {

  constructor() {
    this.AccountablePersons = [];
    this.Sections = [];
  }

  id?: string;
  BuildingName?: string;
  ContactFirstName?: string;
  ContactLastName?: string;
  ContactPhoneNumber?: string;
  ContactEmailAddress?: string;
  NumberBlocksBuilding?: string;
  AccountablePersons: AccountablePersonModel[] = [];
  Sections: SectionModel[] = [];
}

export class SectionModel {
  Name?: string;
  FloorsAbove?: number;
  Height?: number;
  PeopleLivingInBuilding?: any;
  ResidentialUnits?: number;
  YearCompletition?: any;
  CompletitionCertificateIssuer?: any;
  CompletitionCertificateReference?: any;
  Address?: string;
  AnotherSection?: string;
}

export abstract class AccountablePersonModel {
  id?: string;
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
