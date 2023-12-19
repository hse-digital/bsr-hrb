import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, BuildingApplicationStatuscode, Status } from 'src/app/services/application.service';
import { RaConfirmationComponent } from '../ra-confirmation/ra-confirmation.component';
import { ChangeAccountablePersonModelBuilder, ChangeApplicantModelBuilder, ChangeBuildingSummaryModelBuilder, DeregisterBuildingApplicationModelBuilder, RemovedBuildingModelBuilder } from 'src/app/helpers/registration-amendments/registration-amendments-helper';
import { ChangeApplicantHelper } from 'src/app/helpers/registration-amendments/change-applicant-helper';
import { Change, ChangeCategory, ChangeRequest, RegistrationAmendmentsService } from 'src/app/services/registration-amendments.service';
import { ChangeBuildingSummaryHelper } from 'src/app/helpers/registration-amendments/change-building-summary-helper';
import { AddressModel } from 'src/app/services/address.service';
import { ChangedAnswersModel } from 'src/app/helpers/registration-amendments/change-helper';
import { ChangeKbiHelper } from 'src/app/helpers/registration-amendments/change-kbi-helper';
import { ChangeConnectionsHelper } from 'src/app/helpers/registration-amendments/change-connections-helper';
import { KbiService } from 'src/app/services/kbi.service';
import { ChangeAccountablePersonsHelper } from 'src/app/helpers/registration-amendments/change-accountable-persons-helper';

@Component({
  selector: 'hse-ra-declaration',
  templateUrl: './ra-declaration.component.html'
})
export class RaDeclarationComponent extends PageComponent<void> {
  static route: string = 'declaration';
  static title: string = "Declaration about changes - Register a high-rise building - GOV.UK";

  private changeApplicantHelper: ChangeApplicantHelper;
  private syncChangeApplicantHelper: SyncChangeApplicantHelper;
  private syncChangeBuildingSummaryHelper: SyncChangeBuildingSummaryHelper;
  private syncChangeAccountablePersonHelper: SyncChangeAccountablePersonHelper;

  loading = false;

  constructor(activatedRoute: ActivatedRoute, registrationAmendmentsService: RegistrationAmendmentsService, private kbiService: KbiService) {
    super(activatedRoute);
    this.changeApplicantHelper = new ChangeApplicantHelper(this.applicationService);
    this.syncChangeApplicantHelper = new SyncChangeApplicantHelper(this.applicationService, registrationAmendmentsService);
    this.syncChangeBuildingSummaryHelper = new SyncChangeBuildingSummaryHelper(this.applicationService, registrationAmendmentsService);
    this.syncChangeAccountablePersonHelper = new SyncChangeAccountablePersonHelper(this.applicationService, registrationAmendmentsService);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> { }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): Promise<void> {
    await this.submit();
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  newChanges: boolean = false;
  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(RaConfirmationComponent.route, this.activatedRoute, {
      newChanges: this.newChanges
    });
  }

  userActingForPap() {
    let pap = this.applicationService.currentVersion.AccountablePersons[0];
    return pap.Type == 'organisation' && pap.Role == 'registering_for';
  }

  async submit() {
    this.loading = true;
    this.applicationService.model.RegistrationAmendmentsModel!.Date = Date.now();

    this.createUserChangeRequest();
    this.createBuildingSummaryChangeRequest();
    this.createRemovedStructureChangeRequest();
    await this.createDeregisterChangeRequest();
    this.createAccountablePersonChangeRequest();

    if (this.applicationService.previousVersion.Sections.length == 1 && this.applicationService.currentVersion.Sections.length > 1) {
      this.deactivateSingleStructure();
    }

    this.applicationService.previousVersion.ReplacedBy = this.applicationService.currentVersion.Name;
    this.applicationService.currentVersion.Submitted = true;
    this.applicationService.currentVersion.BuildingStatus = Status.NoChanges;
    this.applicationService.currentVersion.ApChangesStatus = Status.NoChanges;
    this.applicationService.updateApplication();

    await this.registrationAmendmentsService.syncChangeRequest();

    this.updateChangeRequestStatus();
    await this.applicationService.updateApplication();

    await this.syncChangeApplicantHelper.syncChangeApplicant();
    await this.syncChangeBuildingSummaryHelper.syncRemovedStructures();
    await this.syncChangeBuildingSummaryHelper.syncDeregister();

    this.updateKbiStatus();

    this.applicationService.currentVersion.ApChangesStatus = Status.ChangesComplete;

    await this.applicationService.syncBuildingStructures();
    await this.applicationService.syncAccountablePersons();

    this.updateAllKbiSections();
  }

  deactivateSingleStructure() {
    this.registrationAmendmentsService.deactivateSingleStructure(this.applicationService.model.BuildingName!,
      this.applicationService.previousVersion.Sections[0].Addresses[0].Postcode!);
  }

  updateKbiStatus() {
    if (!!this.applicationService.currentVersion.Kbi && !!this.applicationService.currentVersion.Kbi.Connections) {
      this.applicationService.currentVersion.Kbi!.Connections.Status = Status.NoChanges;
    }

    if (!!this.applicationService.currentVersion.Kbi && !!this.applicationService.currentVersion.Kbi.KbiSections && this.applicationService.currentVersion.Kbi.KbiSections.length > 0) {
      this.applicationService.currentVersion.Kbi!.KbiSections.map(x => x.Status = Status.NoChanges);
    }

    this.applicationService.updateApplication();
  }

  updateAllKbiSections() {
    this.applicationService.currentVersion.Kbi?.KbiSections.filter(x => x.Status != Status.Removed).forEach(kbiSection => {
      this.kbiService.startKbi(kbiSection);
      this.kbiService.syncFireEnergy(kbiSection);
      this.kbiService.syncStructureRoofStaircasesAndWalls(kbiSection);
      this.kbiService.syncBuilding(kbiSection);
    });
  }

  async createDeregisterChangeRequest() {
    let areYouSure = this.applicationService.model.RegistrationAmendmentsModel?.Deregister?.AreYouSure;

    if (!!areYouSure && areYouSure == "yes") {
      let changeRequest = await this.syncChangeBuildingSummaryHelper.createChangeRequestWhenDeregister();
      if (changeRequest) this.addChangeRequestToModel(changeRequest);
      this.newChanges = true;
    }
  }

  private createUserChangeRequest() {
    if (this.changeApplicantHelper.isSecondaryUserRemoved() || this.changeApplicantHelper.newSecondaryUserExists() || this.changeApplicantHelper.newPrimaryUserExists()) {
      let changeRequest = this.syncChangeApplicantHelper.createChangeRequest();
      changeRequest.Change = [];

      if (this.changeApplicantHelper.isSecondaryUserRemoved() || this.changeApplicantHelper.newSecondaryUserExists()) {
        let change = this.syncChangeApplicantHelper.createChangeForSecondaryUser();
        changeRequest.Change.push(change);
      }

      if (this.changeApplicantHelper.newPrimaryUserExists()) {
        let change = this.syncChangeApplicantHelper.createChangeForPrimaryUser();
        changeRequest.Change.push(change);
      }

      this.addChangeRequestToModel(changeRequest);
    }

  }

  private createBuildingSummaryChangeRequest() {
    let changeRequest = this.syncChangeBuildingSummaryHelper.createChangeRequest();
    let changes = this.syncChangeBuildingSummaryHelper.createChanges();
    if (!!changes && changes.length > 0) {
      changeRequest.Change?.push(...changes);
      this.addChangeRequestToModel(changeRequest);
      this.newChanges = true;
    }
  }

  private createRemovedStructureChangeRequest() {
    let changeRequest: ChangeRequest[] = this.syncChangeBuildingSummaryHelper.createChangeRequestForRemovedStructures() ?? [];
    if (!!changeRequest && changeRequest.length > 0) {
      changeRequest.forEach(x => this.addChangeRequestToModel(x));
      this.newChanges = true;
    }
  }

  private createAccountablePersonChangeRequest() {
    let changeRequest = this.syncChangeAccountablePersonHelper.createChangeRequest();
    let changes = this.syncChangeAccountablePersonHelper.createChanges();
    if (!!changes && changes.length > 0) {
      changeRequest.Change?.push(...changes);
      this.addChangeRequestToModel(changeRequest);
      this.newChanges = true;
    }
  }

  private addChangeRequestToModel(changeRequest: ChangeRequest) {
    if (!this.applicationService.currentVersion.ChangeRequest) {
      this.applicationService.currentVersion.ChangeRequest = [];
    }
    this.applicationService.currentVersion.ChangeRequest?.push(changeRequest);
  }

  private updateChangeRequestStatus() {
    return this.applicationService.currentVersion.ChangeRequest?.forEach(x => x.Status = Status.ChangesSubmitted);
  }

  get onlyRegistrationInformation() {
    let helper = new ChangeBuildingSummaryHelper(this.applicationService);
    return helper.getChanges().length > 0 || helper.getRemovedStructures().length > 0;
  }

  get areasAccountability() {
    return new ChangeAccountablePersonsHelper(this.applicationService).getAreasAccountabilityChanges().length > 0;
  }

  get deregistering() {
    return this.applicationService.currentVersion.ChangeRequest?.find(x => x.Category == ChangeCategory.DeRegistration);
  }

}

export class SyncChangeApplicantHelper {

  private changeApplicantHelper: ChangeApplicantHelper;
  private applicationService: ApplicationService;
  private registrationAmendmentsService: RegistrationAmendmentsService;
  private changeApplicantModelBuilder: ChangeApplicantModelBuilder

  constructor(applicationService: ApplicationService, registrationAmendmentsService: RegistrationAmendmentsService) {
    this.applicationService = applicationService;
    this.changeApplicantHelper = new ChangeApplicantHelper(this.applicationService);
    this.registrationAmendmentsService = registrationAmendmentsService;
    this.changeApplicantModelBuilder = new ChangeApplicantModelBuilder()
      .SetApplicationId(this.applicationService.model.id!)
      .SetBuildingName(this.applicationService.model.BuildingName!);
  }

  async syncChangeApplicant() {

    if (this.changeApplicantHelper.newPrimaryUserExists()) {
      this.changeApplicantHelper.changePrimaryUserStatusToSubmitted();
      this.changeApplicantHelper.setNewPrimaryUserEmail();
    }

    if (this.changeApplicantHelper.isSecondaryUserRemoved()) {
      await this.registrationAmendmentsService.deleteSecondaryUserLookup();
      this.changeApplicantHelper.deleteSecondaryUser();

    } else if (this.changeApplicantHelper.newSecondaryUserExists()) {
      this.changeApplicantHelper.setSecondaryUser();
      this.changeApplicantHelper.updateSecondaryUser();
      await this.registrationAmendmentsService.syncSecondaryUser();

      this.changeApplicantHelper.deleteNewSecondaryUser();
    }
  }

  public createChangeForPrimaryUser() {
    let originalAnswer = this.changeApplicantHelper.getOriginalPrimaryAnswer();
    let newAnswer = this.changeApplicantHelper.getNewPrimaryAnswer();

    return this.changeApplicantModelBuilder.SetField("Primary Applicant")
      .Change(originalAnswer, newAnswer).CreateChange();
  }

  public createChangeForSecondaryUser() {
    let originalAnswer = this.changeApplicantHelper.getOriginalSecondaryAnswer();
    let newAnswer = this.changeApplicantHelper.getNewSecondaryAnswer();

    return this.changeApplicantModelBuilder.SetField("Secondary Applicant")
      .Change(originalAnswer, newAnswer).CreateChange();
  }

  createChangeRequest() {
    return this.changeApplicantModelBuilder!.CreateChangeRequest();
  }
}

export class SyncChangeBuildingSummaryHelper {
  private applicationService: ApplicationService;
  private registrationAmendmentsService: RegistrationAmendmentsService;
  private changeBuildingSummaryModelBuilder: ChangeBuildingSummaryModelBuilder;
  private removedBuildingModelBuilder: RemovedBuildingModelBuilder;
  private deregisterBuildingApplicationModelBuilder: DeregisterBuildingApplicationModelBuilder;

  constructor(applicationService: ApplicationService, registrationAmendmentsService: RegistrationAmendmentsService) {
    this.applicationService = applicationService;
    this.registrationAmendmentsService = registrationAmendmentsService;
    this.changeBuildingSummaryModelBuilder = new ChangeBuildingSummaryModelBuilder()
      .SetApplicationId(this.applicationService.model.id!)
      .SetBuildingName(this.applicationService.model.BuildingName!);

    this.removedBuildingModelBuilder = new RemovedBuildingModelBuilder()
      .SetApplicationId(this.applicationService.model.id!)
      .SetBuildingName(this.applicationService.model.BuildingName!);

    this.deregisterBuildingApplicationModelBuilder = new DeregisterBuildingApplicationModelBuilder()
      .SetApplicationId(this.applicationService.model.id!)
      .SetBuildingName(this.applicationService.model.BuildingName!);

  }

  createChangeRequest() {
    return this.changeBuildingSummaryModelBuilder!.CreateChangeRequest();
  }

  createChanges(): Change[] {
    let helper = new ChangeBuildingSummaryHelper(this.applicationService);
    let buildingSummaryChanges: ChangedAnswersModel[] = helper.getChanges();
    let joinAddresses = (addresses?: AddressModel[]) => !!addresses ? addresses.map(x => x.Postcode).join(" - ") : "";
    let changes: any = [];

    buildingSummaryChanges.forEach((x, index) => {
      let change = (x?.IsAddress ?? false)
        ? this.changeBuildingSummaryModelBuilder.SetField(x?.Title!).Change(joinAddresses(x?.OldAddresses!), joinAddresses(x?.NewAddresses!)).CreateChange()
        : this.changeBuildingSummaryModelBuilder.SetField(x?.Title!).Change(x?.OldValue!, x?.NewValue!).CreateChange();

      changes.push(change);
    });

    changes.push(...this.createKbiChanges());
    changes.push(...this.createConnectionChanges());

    return changes;
  }

  createKbiChanges() {
    let changes: Change[] = [];
    let helper = new ChangeKbiHelper(this.applicationService);
    let kbiSections = this.applicationService.currentVersion.Kbi?.KbiSections ?? [];
    for(let i = 0; i < kbiSections.length; i++) {
      let kbiChanges: ChangedAnswersModel[] = helper.getChangesOf(kbiSections[i], i) ?? [];
      kbiChanges.forEach(x => {
        let name = this.applicationService.currentVersion?.Sections[i]?.Name ?? this.applicationService.model.BuildingName;
        x.Title = `${name} - ${x.Title}`;
        x.OldValue = x.OldValue instanceof Array ? x.OldValue.join(', ') : x.OldValue;
        x.NewValue = x.NewValue instanceof Array ? x.NewValue.join(', ') : x.NewValue;

        let change: Change = this.changeBuildingSummaryModelBuilder.SetField(x?.Title!).Change(x?.OldValue!, x?.NewValue!).CreateChange();
        changes.push(change);
      });
    };
    return changes;
  }

  createConnectionChanges() {
    let changes: Change[] = [];
    let helper = new ChangeConnectionsHelper(this.applicationService);

    let connectionChanges: ChangedAnswersModel[] = helper.getChanges() ?? [];
    connectionChanges.forEach(x => {
      x.OldValue = x.OldValue instanceof Array ? x.OldValue.join(', ') : x.OldValue;
      x.NewValue = x.NewValue instanceof Array ? x.NewValue.join(', ') : x.NewValue;

      let change: Change = this.changeBuildingSummaryModelBuilder.SetField(x?.Title!).Change(x?.OldValue!, x?.NewValue!).CreateChange();
      changes.push(change);
    });

    return changes;
  }

  createChangeRequestForRemovedStructures(): ChangeRequest[] {
    let helper = new ChangeBuildingSummaryHelper(this.applicationService);
    let removedStructures = helper.getRemovedStructures();
    if (!removedStructures || removedStructures.length == 0) return []
    return removedStructures.map( x => this.removedBuildingModelBuilder.SetStructure(x.Name ?? "", x.Addresses[0].Postcode!).CreateChangeRequest());
  }

  async createChangeRequestWhenDeregister() {
    let isAppDeregister = this.applicationService.model.RegistrationAmendmentsModel?.Deregister?.AreYouSure == "yes";

    if (!isAppDeregister || await this.isApplicationCanceled()) return undefined;

    let statuscode = await this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!);
    let appStatus = this.statuscodeText[statuscode];
    let changeRequest = this.deregisterBuildingApplicationModelBuilder.CreateChangeRequest();
    let change = this.deregisterBuildingApplicationModelBuilder.SetField("Application status").Change(appStatus, "Canceled").CreateChange();
    changeRequest.Change = [change];
    return changeRequest;
  }

  async syncRemovedStructures() {
    await this.registrationAmendmentsService.syncRemovedStructures();
  }

  async syncDeregister() {
    let isAppDeregister = this.applicationService.model.RegistrationAmendmentsModel?.Deregister?.AreYouSure == "yes";
    if (isAppDeregister) await this.registrationAmendmentsService.syncDeregister();
  }

  async isApplicationAccepted() {
    let statuscode = await this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!);
    return statuscode == BuildingApplicationStatuscode.Registered || statuscode == BuildingApplicationStatuscode.RegisteredKbiValidated;
  }

  async isApplicationCanceled() {
    let statuscode = await this.applicationService.getBuildingApplicationStatuscode(this.applicationService.model.id!);
    return statuscode == BuildingApplicationStatuscode.Cancelled;
  }

  private statuscodeText: Record<number, string> = {
    760_810_001: "New",
    760_810_002: "In progress",
    760_810_003: "Submitted awaiting allocation",
    760_810_004: "Allocated review",
    760_810_005: "Under review",
    760_810_006: "Registered pending QA",
    760_810_007: "Rejected pending QA",
    760_810_012: "Allocated rework",
    760_810_008: "Ready for QA",
    760_810_015: "Registered",
    760_810_009: "QA in progress",
    760_810_016: "Registered pendingCchange",
    760_810_017: "Registered Kbi validated",
    760_810_011: "Rejected",
    760_810_013: "Withdrawn",
    760_810_014: "On hold",
    760_810_018: "Cancelled",
  }
}

export class SyncChangeAccountablePersonHelper {
  private applicationService: ApplicationService;
  private registrationAmendmentsService: RegistrationAmendmentsService;
  private changeAccountablePersonModelBuilder: ChangeAccountablePersonModelBuilder;

  constructor(applicationService: ApplicationService, registrationAmendmentsService: RegistrationAmendmentsService) {
    this.applicationService = applicationService;
    this.registrationAmendmentsService = registrationAmendmentsService;
    this.changeAccountablePersonModelBuilder = new ChangeAccountablePersonModelBuilder()
      .SetApplicationId(this.applicationService.model.id!)
      .SetBuildingName(this.applicationService.model.BuildingName!);
  }

  createChangeRequest() {
    return this.changeAccountablePersonModelBuilder!.CreateChangeRequest();
  }

  createChanges(): Change[] {
    let helper = new ChangeAccountablePersonsHelper(this.applicationService);
    let accoutablePersonChanges: ChangedAnswersModel[] = [];

    accoutablePersonChanges.push(...helper.getPAPChanges());
    accoutablePersonChanges.push(...helper.getAreasAccountabilityChanges());
    accoutablePersonChanges.push(...helper.getPAPDetailChanges());
    accoutablePersonChanges.push(...helper.getAPDetailChanges());

    let changes: any = [];

    accoutablePersonChanges.forEach((x, index) => {
      x.OldValue = x.OldValue instanceof Array ? x.OldValue.join(', ') : x.OldValue;
      x.NewValue = x.NewValue instanceof Array ? x.NewValue.join(', ') : x.NewValue;

      let change: Change = this.changeAccountablePersonModelBuilder.SetField(x?.Title!).Change(x?.OldValue!, x?.NewValue!).CreateChange();

      changes.push(change);
    });


    return changes;
  }
}
