import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from 'src/app/helpers/page.component';
import { ApplicationService, BuildingApplicationStatus, SectionModel } from 'src/app/services/application.service';
import { AccountablePersonNavigation } from '../../application/accountable-person/accountable-person.navigation';
import { BuildingSummaryNavigation } from '../../application/building-summary/building-summary.navigation';

@Component({
  selector: 'hse-change-task-list',
  templateUrl: './change-task-list.component.html'
})
export class ChangeTaskListComponent extends PageComponent<void> {
  static route: string = 'change-task-list';
  static title: string = "Tell the Building Safety Regulator about changes to this building - Register a high-rise building - GOV.UK";

  applicationStatus = BuildingApplicationStatus;
  taskListSteps = TaskListSteps;
  InScopeSections!: SectionModel[];

  constructor(private buildingNavigation: BuildingSummaryNavigation, private apNavigation: AccountablePersonNavigation) {
    super();
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.InScopeSections = this.applicationService.model.Sections.filter(x => !x.Scope?.IsOutOfScope);
  }

  override onSave(applicationService: ApplicationService, isSaveAndContinue?: boolean | undefined): void | Promise<void> {
    throw new Error('Method not implemented.');
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    throw new Error('Method not implemented.');
  }

  override navigateNext(): Promise<boolean | void> {
    throw new Error('Method not implemented.');
  }  

  containsFlag(flag: BuildingApplicationStatus) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

  async navigateToSections() {
    const route = this.buildingNavigation.getNextRoute();
    await this.navigationService.navigateAppend(route, this.activatedRoute);
  }

  async navigateToPap() {
    const route = this.apNavigation.getNextRoute();
    await this.navigationService.navigateAppend(route, this.activatedRoute);
  }

  getTagFor(step: TaskListSteps, index?: number): string {
    switch(step) {
      case TaskListSteps.BuildingSummary:
        return this.TagToText[this.getBuildingSummaryStatus()];
      case TaskListSteps.AccountablePerson:
        return this.TagToText[this.getAccountablePersonStatus()];
      case TaskListSteps.Kbi:
        return this.TagToText[this.getKbiSectionStatus(index ?? 0)];
      case TaskListSteps.Connections:
        return this.TagToText[this.getConnectionStatus()];
      case TaskListSteps.Changes:
        return this.TagToText[this.getChangesStatus()];
      case TaskListSteps.Submit:
        return this.TagToText[this.getSubmitStatus()];
    }
  }

  getBuildingSummaryStatus(): TagStatus {
    
    return TagStatus.CannotStartYet;
  }

  getAccountablePersonStatus(): TagStatus {
    return TagStatus.CannotStartYet;
  }

  getKbiSectionStatus(index: number) {
    return TagStatus.NotYetAvailable;
  }

  getConnectionStatus() {
    return TagStatus.NotYetAvailable;
  }

  getChangesStatus() {
    return TagStatus.NotYetAvailable;
  }

  getSubmitStatus() {
    return TagStatus.NotYetAvailable;
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