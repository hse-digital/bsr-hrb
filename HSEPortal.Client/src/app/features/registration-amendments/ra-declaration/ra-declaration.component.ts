import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService } from 'src/app/services/application.service';
import { RaConfirmationComponent } from '../ra-confirmation/ra-confirmation.component';
import { ChangeApplicantModelBuilder, ChangeBuildingSummaryModelBuilder } from 'src/app/helpers/registration-amendments/registration-amendments-helper';
import { ChangeApplicantHelper } from 'src/app/helpers/registration-amendments/change-applicant-helper';
import { RegistrationAmendmentsService } from 'src/app/services/registration-amendments.service';
import { BuildingSummaryChangeModel, ChangeBuildingSummaryHelper } from 'src/app/helpers/registration-amendments/change-building-summary-helper';

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
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(RaConfirmationComponent.route, this.activatedRoute);
  }

  userActingForPap() {
    let pap = this.applicationService.model.AccountablePersons[0];
    return pap.Type == 'organisation' && pap.Role == 'registering_for';
  }

  async submit() {
    this.loading = true;
    this.applicationService.model.RegistrationAmendmentsModel!.Date = Date.now();
    
    this.syncChangeApplicantHelper.createChangeRequest();
    this.initialiseChanges();
    
    if (this.changeApplicantHelper.isSecondaryUserRemoved() || this.changeApplicantHelper.newSecondaryUserExists()) {
      this.syncChangeApplicantHelper.createChangeForSecondaryUser();
    }

    if (this.changeApplicantHelper.newPrimaryUserExists()) {
      this.syncChangeApplicantHelper.createChangeForPrimaryUser();
    }

    if((this.applicationService.model.RegistrationAmendmentsModel?.ChangeRequest?.Change?.length ?? 0) > 0) {
      await this.registrationAmendmentsService.syncChangeRequest();
    }

    this.syncChangeBuildingSummaryHelper.createChangeRequest();
    this.initialiseChanges();
    this.syncChangeBuildingSummaryHelper.createChanges();
    
    await this.registrationAmendmentsService.syncChangeRequest();

    await this.syncChangeApplicantHelper.syncChangeApplicant();
    await this.syncChangeBuildingSummaryHelper.syncChangeBuildingSummary(); // TO-DO

  }

  initialiseChanges() {
    if (!this.applicationService.model.RegistrationAmendmentsModel?.ChangeRequest?.Change) {
      this.applicationService.model.RegistrationAmendmentsModel!.ChangeRequest!.Change = [];
    }
  }

  get onlyRegistrationInformation() {
    return false;
  }

  get areasAccountability() {
    return false;
  }

  get deregistering() {
    return false;
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
  
    let change = this.changeApplicantModelBuilder.SetField("Primary Applicant")
      .Change(originalAnswer, newAnswer).CreateChange();

    this.applicationService.model.RegistrationAmendmentsModel?.ChangeRequest?.Change?.push(change);
  }

  public createChangeForSecondaryUser() {
    let originalAnswer = this.changeApplicantHelper.getOriginalSecondaryAnswer();
    let newAnswer = this.changeApplicantHelper.getNewSecondaryAnswer();
  
    let change = this.changeApplicantModelBuilder.SetField("Secondary Applicant")
      .Change(originalAnswer, newAnswer).CreateChange();

    this.applicationService.model.RegistrationAmendmentsModel?.ChangeRequest?.Change?.push(change);
  }

  createChangeRequest() {
    let changeRequest = this.changeApplicantModelBuilder!.CreateChangeRequest();
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeRequest = changeRequest;
  }
}

export class SyncChangeBuildingSummaryHelper {
  private applicationService: ApplicationService;
  private registrationAmendmentsService: RegistrationAmendmentsService;
  private changeBuildingSummaryModelBuilder: ChangeBuildingSummaryModelBuilder

  constructor(applicationService: ApplicationService, registrationAmendmentsService: RegistrationAmendmentsService) {
    this.applicationService = applicationService;
    this.registrationAmendmentsService = registrationAmendmentsService;
    this.changeBuildingSummaryModelBuilder = new ChangeBuildingSummaryModelBuilder()
      .SetApplicationId(this.applicationService.model.id!)
      .SetBuildingName(this.applicationService.model.BuildingName!);
  }

  createChangeRequest() {
    let changeRequest = this.changeBuildingSummaryModelBuilder!.CreateChangeRequest();
    this.applicationService.model.RegistrationAmendmentsModel!.ChangeRequest = changeRequest;
  }

  createChanges() {
    let buildingSummaryChanges: (BuildingSummaryChangeModel | undefined)[] = new ChangeBuildingSummaryHelper(this.applicationService).getOnlyChanges();
    
    buildingSummaryChanges.forEach((x, index) => {
      let change = this.changeBuildingSummaryModelBuilder.SetField(x?.Field!)
      .Change(x?.OldValue!, x?.NewValue!).CreateChange();
  
      this.applicationService.model.RegistrationAmendmentsModel?.ChangeRequest?.Change?.push(change);
    });
  }

  syncChangeBuildingSummary() {

  }
}
