import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { LocalStorage } from "src/app/helpers/local-storage";
import { AddressModel } from "./address.service";
import { FieldValidations } from "../helpers/validators/fieldvalidations";

@Injectable()
export class ApplicationService {
  model: BuildingRegistrationModel;

  _currentSectionIndex;
  _currentSectionAddressIndex;
  _currentAccountablePersonIndex;

  get currentSection(): SectionModel {
    return this.model.Sections[this._currentSectionIndex];
  }

  get currentSectionAddress(): AddressModel {
    return this.currentSection.Addresses[this._currentSectionAddressIndex];
  }

  get currentAccountablePerson(): AccountablePersonModel {
    return this.model.AccountablePersons[this._currentAccountablePersonIndex];
  }

  constructor(private httpClient: HttpClient) {
    this.model = LocalStorage.getJSON('application_data') ?? {};
    this._currentSectionIndex = this.model?.Sections?.length - 1 ?? 0;
    this._currentSectionAddressIndex = !!this.model.Sections && this.model.Sections.length > 0
      ? this.currentSection?.Addresses?.length - 1 : 0;
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

  initKbi() {
    let filteredSections = this.model.Sections.filter(x => !x.Scope?.IsOutOfScope);
    if (!this.model.Kbi) {
      this.model.Kbi = new KbiModel();
      filteredSections.forEach(x => {
        var kbiSection = new KbiSectionModel();
        kbiSection.StructureName = x.Name;
        kbiSection.Postcode = FieldValidations.IsNotNullOrEmpty(x.Addresses) ? x.Addresses[0].Postcode : undefined;

        this.model.Kbi!.KbiSections.push(kbiSection);
      });

      this._currentSectionIndex = 0;
      this._currentKbiSectionIndex = 0;
    }

    if (!this.model.Kbi.SectionStatus || this.model.Kbi.SectionStatus.length == 0) {
      this.model.Kbi.SectionStatus = [];
      filteredSections.map(x => this.model.Kbi!.SectionStatus!.push({ InProgress: false, Complete: false }));
    }
  }

  _currentKbiSectionIndex: number = 0;
  get currentKbiSection() {
    return this.model.Kbi?.KbiSections[this._currentKbiSectionIndex];
  }

  get currentKbiModel() {
    return this.model.Kbi;
  }

  async removeAp(index: number) {
    this.model.AccountablePersons.splice(index, 1);
    await this.updateApplication();
  }

  async removeStructure(index: number) {
    this.model.Sections.at(index)!.Statecode = "1";
    await this.updateApplication();
  }

  async sendVerificationEmail(emailAddress: string, applicationNumber: string, buildingName?: string): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/SendVerificationEmail', { "EmailAddress": emailAddress, "ApplicationNumber": applicationNumber, "BuildingName": buildingName }));
  }

  async validateOTPToken(otpToken: string, emailAddress: string): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/ValidateOTPToken', {
      "OTPToken": otpToken,
      "EmailAddress": emailAddress
    }));
  }

  async isApplicationNumberValid(emailAddress: string, applicationNumber: string): Promise<boolean> {
    try {

      let request = { ApplicationNumber: applicationNumber, EmailAddress: emailAddress };
      await firstValueFrom(this.httpClient.post('api/ValidateApplicationNumber', request));
      return true;
    } catch {
      return false;
    }
  }

  async continueApplication(applicationNumber: string, emailAddress: string, otpToken: string): Promise<void> {

    let request = { ApplicationNumber: applicationNumber, EmailAddress: emailAddress, OtpToken: otpToken };
    let application: BuildingRegistrationModel = await firstValueFrom(this.httpClient.post<BuildingRegistrationModel>('api/GetApplication', request));
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

  async createInvoicePayment(paymentDetails: PaymentInvoiceDetails): Promise<void> {
    await firstValueFrom(this.httpClient.post(`api/InitialiseInvoicePayment/${this.model.id}`, paymentDetails));
  }

  async getApplicationPayments(): Promise<any[]> {
    return await firstValueFrom(this.httpClient.get<any[]>(`api/GetApplicationPaymentStatus/${this.model.id}`));
  }

  async getSubmissionDate(): Promise<string> {
    return await firstValueFrom(this.httpClient.get<string>(`api/GetSubmissionDate/${this.model.id}`));
  }

  async getApplicationCost(): Promise<number> {
    var response = await firstValueFrom(this.httpClient.get<any>('api/GetApplicationCost'));
    return response.applicationCost;
  }

  async getBuildingApplicationStatuscode(applicationid: string): Promise<BuildingApplicationStatuscode> {
    return await firstValueFrom(this.httpClient.get<BuildingApplicationStatuscode>(`api/GetBuildingApplicationStatuscode?applicationid=${applicationid}`));
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
  ApplicationStatus: BuildingApplicationStage = BuildingApplicationStage.None;
  Kbi?: KbiModel;
  PaymentType?: string | undefined;
  PaymentInvoiceDetails?: PaymentInvoiceDetails;
  DuplicateDetected?: boolean;
  ShareDetailsDeclared?: boolean;
  DuplicateBuildingApplicationIds?: string[];
}

export enum BuildingApplicationStage {
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

  Statecode?: string;

  Scope?: Scope;
  Duplicate?: Duplicate;
}

export class Scope {
  IsOutOfScope?: boolean;
  OutOfScopeReason?: OutOfScopeReason;
}

export enum OutOfScopeReason {
  Height, NumberResidentialUnits, PeopleLivingInBuilding
}

export class Duplicate {
  WhyContinue?: string;
  IsDuplicated?: boolean;
  IncludeStructure?: string;
  DuplicationDetected?: string[];
  RegisteredStructureModel?: RegisteredStructureModel;
  BlockIds?: string[];
}

export type RegisteredStructureModel = {
  Name?: string;
  NumFloors?: string;
  Height?: string;
  ResidentialUnits?: string;
  StructureAddress?: AddressModel;
  PapName?: string;
  PapAddress?: AddressModel;
  PapIsOrganisation?: boolean;
  BuildingName?: string;
  BlockId?: string;
  BuildingApplicationId?: string
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
  PaymentLink?: string;
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
  SectionStatus: { InProgress: boolean, Complete: boolean }[] = [];
  KbiSections: KbiSectionModel[] = [];
  Connections: Connections = {};
  Submit: Submit = {};
}

export class KbiSectionModel {
  Fire: Fire = {};
  Energy: Energy = {};
  BuildingStructure: BuildingStructure = {};
  Roof: Roof = {};
  Staircases: Staircases = {}
  Walls: Walls = {};
  BuildingUse: BuildingUse = {};

  StructureName?: string;
  Postcode?: string;
  StrategyEvacuateBuilding?: string;
}

export class Fire {
  StrategyEvacuateBuilding?: string;
  ProvisionsEquipment?: string[];
  FireSmokeProvisions?: string[];
  FireSmokeProvisionLocations?: Record<string, string[]>;
  Lifts?: string[];
  ResidentialUnitFrontDoors?: ResidentialUnitFrontDoors = {};
  FireDoorsCommon?: FireDoorsCommon  = {};
}

export type ResidentialUnitFrontDoors = {
  NoFireResistance?: number,
  ThirtyMinsFireResistance?: number,
  SixtyMinsFireResistance?: number,
  HundredTwentyMinsFireResistance?: number,
  NotKnownFireResistance?: number,
};

export type FireDoorsCommon = {
  FireDoorThirtyMinute?: number,
  FireDoorSixtyMinute?: number,
  FireDoorHundredTwentyMinute?: number,
  FireDoorUnknown?: number,
};

export class Energy {
  EnergySupply?: string[];
  EnergyTypeStorage?: string[];
  OnsiteEnergyGeneration?: string[];
}

export class BuildingStructure {
  BuildingStructureType?: string[];
}

export class Roof {
  RoofType?: string;
  RoofInsulation?: string;
  RoofMaterial?: string;
}

export class Staircases {
  TotalNumberStaircases?: number;
  InternalStaircasesAllFloors?: number;
}

export class Walls {
  ExternalWallMaterials?: string[];
  WallACM?: string;
  WallHPL?: string;
  ExternalWallMaterialsPercentage?: Record<string, string>;
  ExternalWallInsulation?: {
    CheckBoxSelection?: string[],
    OtherValue?: string,
  } = {};
  ExternalWallInsulationPercentages?: Record<string, number>;
  ExternalFeatures?: string[];
  FeatureMaterialsOutside?: Record<string, string[]>;
}

export class BuildingUse {
  AddedFloorsType?: string[];
  PrimaryUseOfBuilding?: string;
  SecondaryUseBuilding?: string[];
  FloorsBelowGroundLevel?: number;
  PrimaryUseBuildingBelowGroundLevel?: string;
  ChangePrimaryUse?: string;
  PreviousUseBuilding?: string;
  YearChangeInUse?: number;
  UndergoneBuildingMaterialChanges?: string[];
  MostRecentMaterialChange?: string;
  YearMostRecentMaterialChange?: string;
}

export class Connections {
  StructureConnections?: string[];
  OtherHighRiseBuildingConnections?: string;
  HowOtherHighRiseBuildingAreConnected?: string[];
  OtherBuildingConnections?: string;
  HowOtherBuildingAreConnected?: string[];
}

export class Submit {

}

export class PaymentInvoiceDetails {
  Name?: string;
  Email?: string;
  AddressLine1?: string;
  AddressLine2?: string;
  Town?: string;
  Postcode?: string;
  OrderNumberOption?: string;
  OrderNumber?: string;
  Status?: string;
}

export enum BuildingApplicationStatuscode
{
    New = 760_810_001,
    InProgress = 760_810_002,
    SubmittedAwaitingAllocation = 760_810_003,
    AllocatedReview = 760_810_004,
    UnderReview = 760_810_005,
    RegisteredPendingQA = 760_810_006,
    RejectedPendingQA = 760_810_007,
    AllocatedRework = 760_810_012,
    ReadyForQA = 760_810_008,
    Registered = 760_810_015,
    QAInProgress = 760_810_009,
    RegisteredPendingChange = 760_810_016,
    RegisteredKbiValidated = 760_810_017,
    Rejected = 760_810_011,
    Withdrawn = 760_810_013,
    OnHold = 760_810_014,
}