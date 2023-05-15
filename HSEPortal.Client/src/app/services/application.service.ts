import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { LocalStorage } from "src/app/helpers/local-storage";
import { AddressModel } from "./address.service";

@Injectable()
export class ApplicationService {
  model: BuildingRegistrationModel;

  _currentSectionIndex;
  _currentAccountablePersonIndex;

  get currentSection(): SectionModel {
    return this.model.Sections[this._currentSectionIndex];
  }

  get currentAccountablePerson(): AccountablePersonModel {
    return this.model.AccountablePersons[this._currentAccountablePersonIndex];
  }

  constructor(private httpClient: HttpClient) {
    this.model = LocalStorage.getJSON('application_data') ?? {};
    this._currentSectionIndex = this.model?.Sections?.length - 1 ?? 0;
    this._currentAccountablePersonIndex = this.model?.AccountablePersons?.length - 1 ?? 0;
  }

  newApplication() {
    LocalStorage.remove('application_data');
    this.model = new BuildingRegistrationModel();
  }

  updateLocalStorage() {
    LocalStorage.setJSON('application_data', this.model)
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

  async startAccountablePersonEdit(): Promise<void> {
    this._currentAccountablePersonIndex = 0;

    if (!this.model.AccountablePersons || this.model.AccountablePersons.length <= 1) {
      let accountablePerson = new AccountablePersonModel();
      accountablePerson.Type = this.model.PrincipalAccountableType;

      this.model.AccountablePersons = [accountablePerson];
      await this.updateApplication();
    }
  }

  startNewAccountablePerson(): string {
    this.model.AccountablePersons.push(new AccountablePersonModel());
    this._currentAccountablePersonIndex = this.model.AccountablePersons.length - 1;

    return `accountable-person-${this._currentAccountablePersonIndex + 1}`;
  }

  _currentKbiSectionIndex: number = 0;
  get currenKbiSection() {
    return this.model.Kbi?.KbiSections[this._currentKbiSectionIndex];
  }

  async removeAp(index: number) {
    this.model.AccountablePersons.splice(index, 1);
    await this.updateApplication();
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
      await firstValueFrom(this.httpClient.get(`api/ValidateApplicationNumber/${emailAddress}/${applicationNumber}`));
      return true;
    } catch {
      return false;
    }
  }

  async continueApplication(applicationNumber: string, emailAddress: string, otpToken: string): Promise<void> {
    var application = await firstValueFrom(this.httpClient.get<BuildingRegistrationModel>(`api/GetApplication/${applicationNumber}/${emailAddress}/${otpToken}`));
    this.model = application;
    this.updateLocalStorage();
  }

  async registerNewBuildingApplication(): Promise<void> {
    this.model = await firstValueFrom(this.httpClient.post<BuildingRegistrationModel>('api/NewBuildingApplication', this.model));
    this.updateLocalStorage();
  }

  async updateApplication(): Promise<void> {
    this.updateLocalStorage();
    await firstValueFrom(this.httpClient.put(`api/UpdateApplication/${this.model.id}`, this.model));
  }

  async updateDynamicsBuildingSummaryStage(): Promise<void> {
    await firstValueFrom(this.httpClient.post(`api/UpdateDynamicsBuildingSummaryStage`, this.model));
  }

  async updateDynamicsAccountablePersonsStage(): Promise<void> {
    await firstValueFrom(this.httpClient.post(`api/UpdateDynamicsAccountablePersonsStage`, this.model));
  }

  async syncBuildingStructures(): Promise<void> {
    await firstValueFrom(this.httpClient.post(`api/SyncBuildingStructures`, this.model));
  }

  async syncAccountablePersons(): Promise<void> {
    await firstValueFrom(this.httpClient.post(`api/SyncAccountablePersons`, this.model));
  }

  async syncDeclaration(): Promise<void> {
    await firstValueFrom(this.httpClient.post(`api/SyncDeclaration`, this.model));
  }

  async syncPayment(): Promise<void> {
    await firstValueFrom(this.httpClient.post(`api/SyncPayment`, this.model));
  }

  async getApplicationPayments(): Promise<any[]> {
    return await firstValueFrom(this.httpClient.get<any[]>(`api/GetApplicationPaymentStatus/${this.model.id}`));
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
  Kbi?: KbiModel;
}

export enum BuildingApplicationStatus {
  None = 0,
  BlocksInBuildingInProgress = 1,
  BlocksInBuildingComplete = 2,
  AccountablePersonsInProgress = 4,
  AccountablePersonsComplete = 8,
  PaymentInProgress = 16,
  PaymentComplete = 32,
  KbiCheckBeforeInProgress = 64,
  KbiCheckBeforeComplete = 128,
  KbiStructureInformationInProgress = 256,
  KbiStructureInformationComplete = 512,
  KbiConnectionsInProgress = 1024,
  KbiConnectionsComplete = 2048,
  KbiSubmitInProgress = 4096,
  KbiSubmitComplete = 8192
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

  CompletionCertificateIssuer?: any;
  CompletionCertificateReference?: any;
  Addresses: AddressModel[] = [];
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

  SectionsAccountability?: SectionAccountability[];
  AddAnother?: string;
}

export class SectionAccountability {
  SectionName!: string;
  Accountability?: string[];
}

export class PaymentModel {
  CreatedDate?: string;
  Status?: string;
  Finished?: boolean;
  PaymentLink!: string;
  Amount?: number;
  Email?: string;
  Reference?: string;
  Description?: string;
  ReturnURL?: string;
  PaymentId?: string;
  PaymentProvider?: string;
  ProviderId?: string;
  ReconciliationStatus?: number;
}

export enum PaymentStatus {
  Started,
  Pending,
  Success,
  Failed
}

export class KbiModel {
  SectionStatus: { inProgress: boolean, complete: boolean }[] = [];
  KbiSections: KbiSectionModel[] = [];
}

export class KbiSectionModel {
  strategyEvacuateBuilding?: string;
  provisionsEquipment?: string[];
  fireSmokeProvisions?: string[];
  fireSmokeProvisionLocations?: Record<string, string[]>;
  lifts?: string[];
  residentialUnitFrontDoors?: { 
    noFireResistance?: number, 
    thirtyMinsFireResistance?: number,
    sixtyMinsFireResistance?: number,
    hundredTwentyMinsFireResistance?: number,
    notKnownFireResistance?: number,
  } = {};
  roofType?: string;
  roofInsulation?: string;
  roofMaterial?: string;
  internalStaircasesAllFloors?: number;
  totalNumberStaircases?: number;
}