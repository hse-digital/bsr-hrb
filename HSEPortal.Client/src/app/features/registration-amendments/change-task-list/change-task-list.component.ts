import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, SectionModel } from 'src/app/services/application.service';
import { TagDirector } from './TagDirector';

@Component({
  selector: 'hse-change-task-list',
  templateUrl: './change-task-list.component.html'
})
export class ChangeTaskListComponent extends PageComponent<void> {
  static route: string = 'change-task-list';
  static title: string = "Tell the Building Safety Regulator about changes to this building - Register a high-rise building - GOV.UK";

  taskListSteps = TaskListSteps;
  InScopeSections!: SectionModel[];
  tagDirector: TagDirector;

  constructor() {
    super();
    this.tagDirector  = new TagDirector(this.registrationAmendmentsService);
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.InScopeSections = this.applicationService.model.Sections.filter(x => !x.Scope?.IsOutOfScope);
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

  getTagFor(step: TaskListSteps, index?: number): string {
    this.tagDirector.setStep(step, index);
    return this.TagToText[this.tagDirector?.getTag()];
  }

  private TagToText: Record<TagStatus, string> = {
    [TagStatus.NotYetAvailable]: "NOT YET AVAILABLE",
    [TagStatus.CannotStartYet]: "CANNOT START YET",
    [TagStatus.ChangesNotYetSubmitted]: "CHANGES NOT YET SUBMITTED",
    [TagStatus.MoreInformationNeeded]: "MORE INFORMATION NEEDED",
    [TagStatus.NoChangesMade]: "NO CHANGES MADE",
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
  MoreInformationNeeded
}