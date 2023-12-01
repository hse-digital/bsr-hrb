import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, BuildingApplicationStage, SectionModel, Status } from 'src/app/services/application.service';
import { TagDirector } from './TagDirector';
import { KbiChangeCheckAnswersModule } from '../change-kbi/check-answers-building-information/kbi.check-answers-building-information.module';
import { ChangeBuildingInformationCheckAnswersComponent } from '../change-kbi/check-answers-building-information/check-answers-building-information.component';
import { KbiNavigation } from '../../kbi/kbi.navigation.ts.service';
import { KbiConnectionsModule } from '../../kbi/8-connections/kbi.connections.module';
import { KbiSubmitModule } from '../../kbi/9-submit/kbi.submit.module';
import { KbiValidator } from 'src/app/helpers/kbi-validator';
import { ChangeKbiHelper } from 'src/app/helpers/registration-amendments/change-kbi-helper';

@Component({
  selector: 'hse-change-task-list',
  templateUrl: './change-task-list.component.html'
})
export class ChangeTaskListComponent extends PageComponent<void> {
  static route: string = 'change-task-list';
  static title: string = "Tell the Building Safety Regulator about changes to this building - Register a high-rise building - GOV.UK";

  taskListSteps = TaskListSteps;
  InScopeKbiSections!: SectionModel[];
  tagDirector?: TagDirector;

  constructor(activatedRoute: ActivatedRoute, private kbiNavigation: KbiNavigation) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.applicationService.validateCurrentVersion();
    this.applicationService.initKbi();
    this.validateKbiSections();
    this.tagDirector = new TagDirector(this.applicationService);

    this.InScopeKbiSections = this.applicationService.currentVersion.Sections
      .filter(x => !x.Scope?.IsOutOfScope && x.Status != Status.Removed);

    if (!this.applicationService.model.RegistrationAmendmentsModel) {
      this.applicationService.model.RegistrationAmendmentsModel = {};
    }
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    return true;
  }

  override async navigateNext(): Promise<boolean | void> {
    return true;
  }  

  async navigateToSections() {
  }

  isKbiSubmitted() {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.KbiSubmitComplete) == BuildingApplicationStage.KbiSubmitComplete;
  }

  isLinkEnable(step: TaskListSteps, index?: number): boolean {
    this.tagDirector?.setStep(step, index);
    let tag = this.tagDirector?.getTag()
    return tag != TagStatus.CannotStartYet && tag != TagStatus.NotYetAvailable;
  }

  getTagFor(step: TaskListSteps, index?: number): string {
    this.tagDirector?.setStep(step, index);
    return this.TagToText[this.tagDirector?.getTag() ?? TagStatus.NotYetAvailable];
  }

  getCssClassFor(step: TaskListSteps, index?: number): string {
    this.tagDirector?.setStep(step, index);
    return this.TagToCssClass[this.tagDirector?.getTag() ?? TagStatus.NotYetAvailable];
  }

  validateKbiSections() {
    this.applicationService.currentVersion.Kbi?.KbiSections.forEach((kbiSection, index) => {
      if (!!kbiSection) {
        let hasChanged = (new ChangeKbiHelper(this.applicationService).getChangesOf(kbiSection, index) ?? []).length > 0;
        if (hasChanged) {
          this.applicationService.currentVersion.Kbi!.KbiSections.at(index)!.Status = KbiValidator.isKbiSectionValid(kbiSection)
            ? Status.ChangesComplete 
            : Status.ChangesInProgress;
        }
      }
    });
  }

  async navigateToKbi(index: number) {
    let route = this.kbiNavigation.getNextRoute(index);

    if (route.startsWith(KbiConnectionsModule.baseRoute) || route.startsWith(KbiSubmitModule.baseRoute) || route.startsWith("check-answers")) {
      return this.navigationService.navigateRelative(`${KbiChangeCheckAnswersModule.baseRoute}/${ChangeBuildingInformationCheckAnswersComponent.route}`, this.activatedRoute, {
        index: index
      });
    } else {
      let query = route.split('?');
      let params: any = {};
      if (query.length > 1) {
        let queryParam = query[1].split('=');
        params[queryParam[0]] = queryParam[1];
      }

      this.applicationService.model.RegistrationAmendmentsModel!.KbiChangeTaskList = true;
      return this.navigationService.navigateAppend(`../../kbi/${(index + 1)}/${query[0]}`, this.activatedRoute, params);
    }
  }

  get submitSectionNumber() {
    let sectionNumber = 2;
    sectionNumber += !this.applicationService.model.IsSecondary ? 1 : 0;
    sectionNumber += this.isKbiSubmitted() ? 1 : 0;
    return sectionNumber;
  }

  private TagToText: Record<TagStatus, string> = {
    [TagStatus.NotYetAvailable]: "NOT YET AVAILABLE",
    [TagStatus.CannotStartYet]: "CANNOT START YET",
    [TagStatus.ChangesNotYetSubmitted]: "CHANGES NOT YET SUBMITTED",
    [TagStatus.MoreInformationNeeded]: "MORE INFORMATION NEEDED",
    [TagStatus.NoChangesMade]: "NO CHANGES MADE",
    [TagStatus.NotStarted]: "NOT STARTED",
  }

  private TagToCssClass: Record<TagStatus, string> = {
    [TagStatus.NotYetAvailable]: "govuk-tag--grey",
    [TagStatus.CannotStartYet]: "govuk-tag--grey",
    [TagStatus.ChangesNotYetSubmitted]: "govuk-tag--blue",
    [TagStatus.MoreInformationNeeded]: "govuk-tag--red",
    [TagStatus.NoChangesMade]: "govuk-tag--grey",
    [TagStatus.NotStarted]: "govuk-tag--grey",
  }

}

export enum TaskListSteps {
  BuildingSummary,
  AccountablePerson,
  Kbi,
  Connections,
  Changes,
  Submit
}

export enum TagStatus {
  NotYetAvailable,
  NoChangesMade,
  CannotStartYet,
  ChangesNotYetSubmitted,
  MoreInformationNeeded,
  NotStarted
}