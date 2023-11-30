import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, BuildingApplicationStatuscode, Status } from 'src/app/services/application.service';
import { RaConfirmationComponent } from '../ra-confirmation/ra-confirmation.component';
import { ChangeApplicantModelBuilder, ChangeBuildingSummaryModelBuilder, RemovedBuildingModelBuilder } from 'src/app/helpers/registration-amendments/registration-amendments-helper';
import { ChangeApplicantHelper } from 'src/app/helpers/registration-amendments/change-applicant-helper';
import { Change, ChangeCategory, ChangeRequest, RegistrationAmendmentsService } from 'src/app/services/registration-amendments.service';
import { ChangeBuildingSummaryHelper } from 'src/app/helpers/registration-amendments/change-building-summary-helper';
import { AddressModel } from 'src/app/services/address.service';
import { ChangedAnswersModel } from 'src/app/helpers/registration-amendments/change-helper';
import { ChangeKbiHelper } from 'src/app/helpers/registration-amendments/change-kbi-helper';
import { ChangeConnectionsHelper } from 'src/app/helpers/registration-amendments/change-connections-helper';

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

  loading = false;

  constructor(activatedRoute: ActivatedRoute, registrationAmendmentsService: RegistrationAmendmentsService) {
    super(activatedRoute);
    this.changeApplicantHelper = new ChangeApplicantHelper(this.applicationService);
    this.syncChangeApplicantHelper = new SyncChangeApplicantHelper(this.applicationService, registrationAmendmentsService);
    this.syncChangeBuildingSummaryHelper = new SyncChangeBuildingSummaryHelper(this.applicationService, registrationAmendmentsService);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> { }

  override async onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): Promise<void> {
    await this.submit();
    await this.applicationService.syncBuildingStructures();
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
    this.createDeregisterChangeRequest();

    if (this.applicationService.previousVersion.Sections.length == 1 && this.applicationService.currentVersion.Sections.length > 1) {
      this.deactivateSingleStructure();
    }

    this.applicationService.previousVersion.ReplacedBy = this.applicationService.currentVersion.Name;
    this.applicationService.currentVersion.Submitted = true;
    this.applicationService.currentVersion.BuildingStatus = Status.NoChanges;
    this.applicationService.updateApplication();

    await this.registrationAmendmentsService.syncChangeRequest();
    
    this.updateChangeRequestStatus();
    await this.applicationService.updateApplication();

    await this.syncChangeApplicantHelper.syncChangeApplicant();
    await this.syncChangeBuildingSummaryHelper.syncRemovedStructures();
    await this.syncChangeBuildingSummaryHelper.syncDeregister();

    this.updateKbiStatus();
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
  
  createDeregisterChangeRequest() {
    let areYouSure = this.applicationService.model.RegistrationAmendmentsModel?.Deregister?.AreYouSure;
    if (!!areYouSure && areYouSure == "yes") {
      let changeRequest = this.syncChangeBuildingSummaryHelper.createChangeRequestWhenDeregister();
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
    return false;
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

  constructor(applicationService: ApplicationService, registrationAmendmentsService: RegistrationAmendmentsService) {
    this.applicationService = applicationService;
    this.registrationAmendmentsService = registrationAmendmentsService;
    this.changeBuildingSummaryModelBuilder = new ChangeBuildingSummaryModelBuilder()
      .SetApplicationId(this.applicationService.model.id!)
      .SetBuildingName(this.applicationService.model.BuildingName!);
    
    this.removedBuildingModelBuilder = new RemovedBuildingModelBuilder()
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

  createChangeRequestWhenDeregister(): ChangeRequest | undefined {
    let isAppDeregister = this.applicationService.model.RegistrationAmendmentsModel?.Deregister?.AreYouSure == "yes";

    if (!isAppDeregister) return undefined;
    
    return this.removedBuildingModelBuilder.CreateChangeRequest();
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


}
