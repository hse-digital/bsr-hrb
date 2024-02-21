import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { first, firstValueFrom } from "rxjs";
import { LocalStorage } from "src/app/helpers/local-storage";
import { AddressModel } from "./address.service";
import { FieldValidations } from "../helpers/validators/fieldvalidations";
import { CancellationReason, ChangeRequest } from "./registration-amendments.service";
import { Sanitizer } from "./http-interceptor";
import { GetInjector } from "../helpers/injector.helper";
import { BuildingSummaryNavigation } from "../features/application/building-summary/building-summary.navigation";

@Injectable()
export class ApplicationService {
  model: BuildingRegistrationModel;

  _currentVersion;
  _currentSectionIndex;
  _currentSectionAddressIndex;
  _currentAccountablePersonIndex;

  get currentSection(): SectionModel {
    return this.currentVersion.Sections[this._currentSectionIndex];
  }

  get currentVersion(): BuildingRegistrationVersion {
    return this.model.Versions?.[this._currentVersion];
  }

  get previousVersion(): BuildingRegistrationVersion {
    let versionIndex = this.model.Versions.findIndex(x => !FieldValidations.IsNotNullOrWhitespace(x.ReplacedBy) && x.Submitted == true && x.Name != 'original');
    return versionIndex != -1 ? this.model.Versions[versionIndex] : this.model.Versions[0];
  }

  get currentSectionAddress(): AddressModel {
    return this.currentSection.Addresses[this._currentSectionAddressIndex];
  }

  get currentAccountablePerson(): AccountablePersonModel {
    return this.currentVersion.AccountablePersons[this._currentAccountablePersonIndex];
  }

  get isChangeAmendmentInProgress(): boolean {
    return this.currentVersion.Name != 'original' && (this.currentVersion.ReplacedBy == null || this.currentVersion.ReplacedBy == '');
  }

  constructor(private httpClient: HttpClient) {
    this.model = LocalStorage.getJSON('application_data') ?? {};
    this._currentVersion = LocalStorage.getJSON("versionindex") ?? 0;
    this._currentSectionIndex = this.currentVersion?.Sections?.length - 1 ?? 0;
    this._currentSectionAddressIndex = !!this.currentVersion?.Sections && this.currentVersion?.Sections.length > 0 ? this.currentSection?.Addresses?.length - 1 : 0;
    this._currentAccountablePersonIndex = this.currentVersion?.AccountablePersons?.length - 1 ?? 0;
  }

  newApplication() {
    LocalStorage.remove('application_data');
    this.model = new BuildingRegistrationModel();
  }

  validateCurrentVersion() {
    var currentVersion = this.model.Versions.findIndex(x => (x.Submitted == null || x.Submitted == false) && x.Name != 'original');
    if (currentVersion == -1) {
      this.setVersionIndex(this.getVersionIndex());

      var newVersion: BuildingRegistrationVersion = JSON.parse(JSON.stringify(this.currentVersion));

      newVersion.ReplacedBy = "";
      newVersion.Submitted = false;
      newVersion.CreatedBy = this.model.IsSecondary ? this.model.SecondaryEmailAddress : this.model.ContactEmailAddress;

      var newIndex = this.model.Versions.length;
      newVersion.Name = `V${newIndex}`;

      this.model.Versions.push(newVersion);
      currentVersion = newIndex;
    }
    this.setVersionIndex(currentVersion);
  }

  private getVersionIndex() {
    let index = this.model?.Versions?.findIndex(x => x.Submitted && !FieldValidations.IsNotNullOrWhitespace(x.ReplacedBy) && x.Name != 'original');
    return !index || index == -1 ? 0 : index;
  }

  resetCurrentVersionIndex() {
    this.setVersionIndex(0);
  }

  private setVersionIndex(index: number) {
    this._currentVersion = index;
    LocalStorage.setJSON("versionindex", this._currentVersion);
    this.updateApplication();
  }

  updateLocalStorage() {
    LocalStorage.setJSON('application_data', this.model)
  }

  nextKnockOnQuestion() {
    const buildingSummaryNavigation = GetInjector().get(BuildingSummaryNavigation);
    return buildingSummaryNavigation.getNextKnockOnQuestion(this.currentSection);
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
    this.currentVersion.Sections = [new SectionModel()];
  }

  startNewSection(): string {
    this.currentVersion.Sections.push(new SectionModel());
    this._currentSectionIndex = this.currentVersion.Sections.length - 1;

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

    if (!this.currentVersion.AccountablePersons || this.currentVersion.AccountablePersons.length <= 1) {
      let accountablePerson = new AccountablePersonModel();
      accountablePerson.Type = this.model.PrincipalAccountableType;

      this.currentVersion.AccountablePersons = [accountablePerson];
      await this.updateApplication();
    }
  }

  startNewAccountablePerson(): string {
    this.currentVersion.AccountablePersons.push(new AccountablePersonModel());
    this._currentAccountablePersonIndex = this.currentVersion.AccountablePersons.length - 1;

    return `accountable-person-${this._currentAccountablePersonIndex + 1}`;
  }

  initKbi() {
    let filteredSections = this.currentVersion.Sections.filter(x => !x.Scope?.IsOutOfScope && x.Status != Status.Removed);
    if (!this.currentVersion.Kbi || !this.currentVersion.Kbi.KbiSections || this.currentVersion.Kbi.KbiSections.length == 0) {
      this.initKbiModel(filteredSections);
    } else if (this.currentVersion.Kbi.KbiSections.length != filteredSections.length || !this.areKbiSectionsValid(filteredSections)) {
      this.updateKbiModel(filteredSections);
    }
    this.removeUnnecessaryKbiSections();
    this.updateKbiSectionStatus(filteredSections);
    this.updateApplication();
  }

  private initKbiModel(filteredSections: SectionModel[]) {
    this.currentVersion.Kbi = new KbiModel();
    filteredSections.forEach(x => {
      var kbiSection = new KbiSectionModel();
      kbiSection.StructureName = x.Name;
      kbiSection.Postcode = FieldValidations.IsNotNullOrEmpty(x.Addresses) ? x.Addresses[0].Postcode : undefined;

      this.currentVersion.Kbi!.KbiSections.push(kbiSection);
    });

    this._currentSectionIndex = 0;
    this._currentKbiSectionIndex = 0;
  }

  private updateKbiModel(filteredSections: SectionModel[]) {
    let sectionHasKbi = (section: SectionModel) => this.currentVersion.Kbi?.KbiSections.some(kbiSection => kbiSection.StructureName == section.Name && this.arePostcodesEqual(kbiSection.Postcode, section.Addresses[0].Postcode))

    filteredSections.forEach(section => {
      if (!sectionHasKbi(section)) {
        var newKbiSection = new KbiSectionModel();
        newKbiSection.StructureName = section.Name;
        newKbiSection.Postcode = FieldValidations.IsNotNullOrEmpty(section.Addresses) ? section.Addresses[0].Postcode : undefined;
        newKbiSection.Status = Status.ChangesInProgress;

        this.currentVersion.Kbi!.KbiSections.push(newKbiSection);
        this.currentVersion.Kbi!.SectionStatus!.push({ InProgress: false, Complete: false });
      }
    });
  }

  private areKbiSectionsValid(filteredSections: SectionModel[]) {
    return filteredSections.every(x => (this.currentVersion.Kbi?.KbiSections.findIndex(kbi => kbi?.StructureName == x.Name && this.arePostcodesEqual(kbi?.Postcode, x.Addresses[0].Postcode)) ?? -1) > -1)
  }

  private removeUnnecessaryKbiSections() {
    let removedSections = this.currentVersion.Sections.filter(x => x.Scope?.IsOutOfScope || x.Status == Status.Removed);
    removedSections.forEach(section => {
      let index = this.currentVersion.Kbi?.KbiSections.findIndex(kbiSection => kbiSection.StructureName == section.Name && this.arePostcodesEqual(kbiSection.Postcode, section.Addresses[0].Postcode));
      if (!!index && index > -1) {
        this.currentVersion.Kbi!.KbiSections.at(index)!.Status = Status.Removed;
        this.currentVersion.Kbi!.SectionStatus!.splice(index!, 1);
      }
    });
  }

  private updateKbiSectionStatus(filteredSections: SectionModel[]) {
    if (!this.currentVersion.Kbi?.SectionStatus || this.currentVersion.Kbi?.SectionStatus.length == 0) {
      this.currentVersion.Kbi!.SectionStatus = [];
      filteredSections.map(x => this.currentVersion.Kbi!.SectionStatus!.push({ InProgress: false, Complete: false }));
    }

    let missingStatuses = this.currentVersion.Kbi!.KbiSections.length - this.currentVersion.Kbi!.SectionStatus.length
    if (missingStatuses != 0 && missingStatuses > 0) {
      for (let index = 0; index < missingStatuses; index++) {
        this.currentVersion.Kbi!.SectionStatus!.push({ InProgress: false, Complete: false });
      }
    }
  }

  private arePostcodesEqual(a?: string, b?: string) {
    if (!FieldValidations.IsNotNullOrWhitespace(a) || !FieldValidations.IsNotNullOrWhitespace(b)) return false;
    return a!.trim().replaceAll(' ', '').toLowerCase() == b!.trim().replaceAll(' ', '').toLowerCase();
  }

  _currentKbiSectionIndex: number = 0;

  get currentKbiSection() {
    return this.currentVersion.Kbi?.KbiSections[this._currentKbiSectionIndex];
  }

  get currentKbiModel() {
    return this.currentVersion.Kbi;
  }

  async removeAp(index: number) {
    this.currentVersion.AccountablePersons.splice(index, 1);
    await this.updateApplication();
  }

  async removeStructure(index: number) {
    this.currentVersion.Sections.at(index)!.Statecode = "1";
    await this.updateApplication();
  }

  async sendVerificationEmail(emailAddress: string, applicationNumber: string, buildingName?: string): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/SendVerificationEmail', {
      "EmailAddress": Sanitizer.sanitizeField(emailAddress),
      "ApplicationNumber": applicationNumber,
      "BuildingName": buildingName
    }));
  }

  async validateOTPToken(otpToken: string, emailAddress: string): Promise<void> {
    await firstValueFrom(this.httpClient.post('api/ValidateOTPToken', {
      "OTPToken": otpToken,
      "EmailAddress": emailAddress
    }));
  }

  async isApplicationNumberValid(emailAddress: string, applicationNumber: string): Promise<boolean> {
    try {
      let request = { ApplicationNumber: applicationNumber, EmailAddress: Sanitizer.sanitizeField(emailAddress) };
      await firstValueFrom(this.httpClient.post('api/ValidateApplicationNumber', request));
      return true;
    } catch {
      return false;
    }
  }

  async isChangeRequestAccepted(): Promise<string> {
    return await firstValueFrom(this.httpClient.get<string>(`api/IsChangeRequestAccepted/${this.model.id}`));
  }


  async continueApplication(applicationNumber: string, emailAddress: string, otpToken: string): Promise<void> {
    let request = {
      ApplicationNumber: applicationNumber,
      EmailAddress: Sanitizer.sanitizeField(emailAddress),
      OtpToken: otpToken
    };
    let application: BuildingRegistrationModel = await firstValueFrom(this.httpClient.post<BuildingRegistrationModel>('api/GetApplication', request));
    this.model = application;
    this.updateLocalStorage();
  }

  async registerNewBuildingApplication(): Promise<void> {
    this.model = await firstValueFrom(this.httpClient.post<BuildingRegistrationModel>('api/NewBuildingApplication', this.model));
    this.updateLocalStorage();
  }

  async updateApplication(): Promise<void> {
    if (this.model.id) {
      this.updateLocalStorage();
      await firstValueFrom(this.httpClient.put(`api/UpdateApplication/${this.model.id}`, this.model));
    }
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

  async getKbiSubmissionDate(): Promise<string> {
    return await firstValueFrom(this.httpClient.get<string>(`api/GetKbiSubmissionDate/${this.model.id}`));
  }

  async getApplicationCost(): Promise<number> {
    var response = await firstValueFrom(this.httpClient.get<any>('api/GetApplicationCost'));
    return response.applicationCost;
  }

  async getBuildingApplicationStatuscode(applicationid: string): Promise<BuildingApplicationStatuscode> {
    return await firstValueFrom(this.httpClient.get<BuildingApplicationStatuscode>(`api/GetBuildingApplicationStatuscode?applicationid=${applicationid}`));
  }

  async verifyPaymentStatus(): Promise<void> {
    var payments = await this.getApplicationPayments();
    var hasSuccessfulPayment = payments.find(x => x.bsr_govukpaystatus == "success");
    if (hasSuccessfulPayment) {
      this.model.ApplicationStatus = this.model.ApplicationStatus | BuildingApplicationStage.PaymentComplete;
      this.updateApplication();
    }
  }

  async searchPublicRegister(postcode: string, uprn?: string): Promise<any[]> {
    return await firstValueFrom(this.httpClient.get<any[]>(`api/SearchPublicRegister?postcode=${postcode}&uprn=${uprn}`));
  }

  async getStructuresForApplication(applicationId: string): Promise<any[]> {
    return await firstValueFrom(this.httpClient.get<any[]>(`api/GetStructuresForApplication?applicationId=${applicationId}`));
  }

  async updateSafetyCaseReportDeclaration(applicationNumber: string, date: string): Promise<void> {
    await firstValueFrom(this.httpClient.post(`api/UpdateSafetyCaseDeclaration`, {
      "ApplicationNumber": applicationNumber,
      "Date": date
    }));
  }
}

export class BuildingRegistrationModel {
  id?: string;
  BuildingName?: string;
  ContactFirstName?: string;
  ContactLastName?: string;
  ContactPhoneNumber?: string;
  ContactEmailAddress?: string;
  NewPrimaryUserEmail?: string;
  SecondaryFirstName?: string;
  SecondaryLastName?: string;
  SecondaryPhoneNumber?: string;
  SecondaryEmailAddress?: string;
  IsSecondary?: boolean;
  NumberOfSections?: string;
  PrincipalAccountableType?: string;
  ApplicationStatus: BuildingApplicationStage = BuildingApplicationStage.None;
  PaymentType?: string | undefined;
  PaymentInvoiceDetails?: PaymentInvoiceDetails;
  DuplicateDetected?: boolean;
  ShareDetailsDeclared?: boolean;
  DuplicateBuildingApplicationIds?: string[];
  RegistrationAmendmentsModel?: RegistrationAmendmentsModel;
  FilesUploaded: any;

  SafetyCaseReport?: SafetyCaseReport;

  ApplicationCertificate?: ApplicationCertificateModel

  // versioning
  Versions: BuildingRegistrationVersion[] = [];
}

export class SafetyCaseReport {
  date?: string;
  declaration?: boolean;
}

export class ApplicationCertificateModel {
  BsrInformationConfirmed?: boolean;
  ComplianceNoticeNumbers?: string;
  Section89DeclarationConfirmed?: boolean;
}

export class BuildingRegistrationVersion {
  constructor() {
    this.AccountablePersons = [];
    this.Sections = [];
  }

  Name?: string;
  ReplacedBy?: string;
  CreatedBy?: string;
  Submitted?: boolean;

  BuildingStatus: Status = Status.NoChanges;
  ApChangesStatus: Status = Status.NoChanges;

  Sections: SectionModel[] = [];
  AccountablePersons: AccountablePersonModel[] = [];
  Kbi?: KbiModel;

  ChangeRequest?: ChangeRequest[];
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

  WhoIssuedCertificate?: string;
  CompletionCertificateDate?: string;
  CompletionCertificateIssuer?: any;
  CompletionCertificateReference?: any;
  CompletionCertificateFile?: { Filename: string, Uploaded: boolean };
  Addresses: AddressModel[] = [];

  Statecode?: string;

  Scope?: Scope;
  Duplicate?: Duplicate;

  Status: Status = Status.NoChanges;
  WhyWantRemoveSection?: string;
  RemoveStructureAreYouSure?: string;
  CancellationReason?: CancellationReason;
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
  DuplicateFound?: boolean;
  RegisteredStructureModel?: RegisteredStructureModel;
  BlockIds?: string[];
  DuplicatedAddressIndex?: string;
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
  Status: Status = Status.NoChanges;
}

export class Fire {
  StrategyEvacuateBuilding?: string;
  ProvisionsEquipment?: string[];
  FireSmokeProvisions?: string[];
  FireSmokeProvisionLocations?: Record<string, string[]>;
  Lifts?: string[];
  ResidentialUnitFrontDoors?: ResidentialUnitFrontDoors = {};
  FireDoorsCommon?: FireDoorsCommon = {};
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
  Status?: Status;
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

export class RegistrationAmendmentsModel {
  AccountablePersonStatus?: ChangeAccountablePerson;
  Deregister?: Deregister;
  ChangeUser?: ChangeUser;
  Date?: number;
  KbiChangeTaskList?: boolean;
}

export class ChangeAccountablePerson {
  Status: Status = Status.NoChanges;
  NewPap?: boolean;
}

export class Deregister {
  AreYouSure?: string;
  Why?: string;
  CancellationReason?: CancellationReason;
}

export class ChangeUser {
  PrimaryUser?: User;
  NewPrimaryUser?: User;
  SecondaryUser?: User;
  NewSecondaryUser?: User;
  WhoBecomePrimary?: string;
  WhoBecomeSecondary?: string;
}

export class User {
  Status: Status = Status.NoChanges;
  Firstname?: string;
  Lastname?: string;
  Email?: string;
  PhoneNumber?: string;
}

export enum Status {
  NoChanges = 0,
  ChangesInProgress = 1,
  ChangesComplete = 2,
  ChangesSubmitted = 4,
  Removed = 8
}

export enum BuildingApplicationStatuscode {
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
  Cancelled = 760_810_018
}

export class FileUploadModel {
  Progress: number = 0;
  FileName?: string;
  Status?: string;
  Message?: string;
  CaseId?: string;
}
