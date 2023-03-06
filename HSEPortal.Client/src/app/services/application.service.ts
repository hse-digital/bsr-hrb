import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { LocalStorage } from "src/app/helpers/local-storage";
import { AddressModel } from "./address.service";

@Injectable()
export class ApplicationService {
  model: BuildingRegistrationModel;

  _currentSectionIndex = 0;
  _currentAccountablePersonIndex = 0;

  get currentSection(): SectionModel {
    return this.model.Sections[this._currentSectionIndex];
  }

  get currentAccountablePerson(): AccountablePersonModel {
    return this.model.AccountablePersons[this._currentAccountablePersonIndex];
  }

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

  clearApplication() {
    this.model = new BuildingRegistrationModel();
    this.updateLocalStorage();
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

    return `section-${this._currentSectionIndex + 1}`;
  }

  selectSection(sectionName: string) {
    let index = Number(sectionName.split('-').at(-1));
    this._currentSectionIndex = index - 1;
  }

  selectAccountablePerson(apName: string) {
    let index = Number(apName.split('-').at(-1));
    this._currentAccountablePersonIndex = index - 1;
  }

  startAccountablePersonEdit(): string {
    this._currentAccountablePersonIndex = 0;

    if (!this.model.AccountablePersons || this.model.AccountablePersons.length == 0) {
      let accountablePerson = new AccountablePersonModel();
      accountablePerson.Type = this.model.PrincipalAccountableType;

      this.model.AccountablePersons = [accountablePerson];
    }

    return `accountable-person-${this._currentAccountablePersonIndex + 1}`;
  }

  startNewAccountablePerson(): string {
    this.model.AccountablePersons.push(new AccountablePersonModel());
    this._currentAccountablePersonIndex = this.model.AccountablePersons.length - 1;

    return `accountable-person-${this._currentAccountablePersonIndex + 1}`;
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

  async updateApplication(): Promise<void> {
    await firstValueFrom(this.httpClient.put(`api/UpdateApplication/${this.model.id}`, this.model));
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
  NumberOfSections?: string;
  Sections: SectionModel[] = [];
  OutOfScopeContinueReason?: string;
  PrincipalAccountableType?: string;
  AccountablePersons: AccountablePersonModel[] = [];
  ApplicationStatus: BuildingApplicationStatus = BuildingApplicationStatus.None;
}

export enum BuildingApplicationStatus {
  None = 0,
  BlocksInBuildingInProgress = 1,
  BlocksInBuildingComplete = 2,
  AccountablePersonsInProgress = 4,
  AccountablePersonsComplete = 8,
  PaymentInProgress = 16,
  PaymentComplete = 32
}

export class SectionModel {
  Name?: string;
  FloorsAbove?: number;
  Height?: number;
  PeopleLivingInBuilding?: any;
  ResidentialUnits?: number;

  YearOfCompletionOption?: any;
  YearOfCompletion?: string;
  YearOfCompletionRange?: string;

  CompletitionCertificateIssuer?: any;
  CompletitionCertificateReference?: any;
  Addresses: AddressModel[] = [];
  AnotherSection?: string;
}

export class AccountablePersonModel {
  Type?: string;
  IsPrincipal?: string;
  Address?: AddressModel;
  PapAddress?: AddressModel;

  OrganisationName?: string;
  OrganisationType?: string;
  OrganisationTypeDescription?: string;
  NamedContactFirstName?: string;
  NamedContactLastName?: string;
  NamedContactEmail?: string;
  NamedContactPhoneNumber?: string;

  FirstName?: string;
  LastName?: string;
  Email?: string;
  PhoneNumber?: string;
  Role?: string;
  LeadJobRole?: string;

  ActingForSameAddress?: string;
  ActingForAddress?: AddressModel;
  LeadFirstName?: string;
  LeadLastName?: string;
  LeadEmail?: string;
  LeadPhoneNumber?: string;

  SectionsAccountability?: string[][];
}
