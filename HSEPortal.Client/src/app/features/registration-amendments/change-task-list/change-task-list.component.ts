import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, BuildingApplicationStage, KbiSectionModel, SectionModel, Status } from 'src/app/services/application.service';
import { TagDirector } from './TagDirector';
import { KbiChangeCheckAnswersModule } from '../change-kbi/check-answers-building-information/kbi.check-answers-building-information.module';
import { ChangeBuildingInformationCheckAnswersComponent } from '../change-kbi/check-answers-building-information/check-answers-building-information.component';

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

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.applicationService.validateCurrentVersion();
    this.tagDirector  = new TagDirector(this.applicationService);

    this.InScopeKbiSections = this.applicationService.currentVersion.Sections
      .filter(x => !x.Scope?.IsOutOfScope && x.Status != Status.Removed);

    if(!this.applicationService.model.RegistrationAmendmentsModel) {
      this.applicationService.model.RegistrationAmendmentsModel = {
        ConnectionStatus: Status.NoChanges,
        SubmitStatus: Status.NoChanges,
      };
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

  async navigateToPap() {
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

  async navigateToKbi(index: number) {
    return this.navigationService.navigateRelative(`${KbiChangeCheckAnswersModule.baseRoute}/${ChangeBuildingInformationCheckAnswersComponent.route}`, this.activatedRoute, {
      index: index
    });
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