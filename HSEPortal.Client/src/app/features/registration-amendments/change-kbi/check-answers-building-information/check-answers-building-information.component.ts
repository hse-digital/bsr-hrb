import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, BuildingApplicationStage, KbiSectionModel, Status } from 'src/app/services/application.service';
import { KbiService } from 'src/app/services/kbi.service';
import { KbiValidator } from 'src/app/helpers/kbi-validator'
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { ChangeKbiHelper } from 'src/app/helpers/registration-amendments/change-kbi-helper';

@Component({
  templateUrl: './check-answers-building-information.component.html',
  styleUrls: ['./check-answers-building-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangeBuildingInformationCheckAnswersComponent extends PageComponent<void> {
  static route: string = 'change-check-answers';
  static title: string = "Check your building information answers - Register a high-rise building - GOV.UK";

  kbiSection: KbiSectionModel = new KbiSectionModel;
  shouldRender: boolean = false;

  constructor(activatedRoute: ActivatedRoute, private kbiService: KbiService) {
    super(activatedRoute);
  }

  protected index?: number;
  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.shouldRender = false;
    this.activatedRoute.queryParams.subscribe(params => {
      this.index = params['index'];
      let numKbiSections = this.applicationService.currentVersion.Kbi?.KbiSections.length ?? 0;
      if (!this.index || numKbiSections <= this.index || this.index < 0) this.navigationService.navigate(NotFoundComponent.route);

      this.kbiSection = this.applicationService.currentVersion.Kbi?.KbiSections[this.index!]!;

      this.updateKbiChangeStatus();
      this.shouldRender = true;
    });
  }

  private updateKbiChangeStatus() {
    if(new ChangeKbiHelper(this.applicationService)?.getChangesOf(this.kbiSection!, this.index!)!.length! > 0) {
      this.applicationService.currentVersion.Kbi!.KbiSections.at(this.index!)!.Status = KbiValidator.isKbiSectionValid(this.kbiSection)
        ? Status.ChangesComplete 
        : Status.ChangesInProgress;
    } else {
      this.applicationService.currentVersion.Kbi!.KbiSections.at(this.index!)!.Status = Status.NoChanges;
    }
  }

  hasIncompleteData = false;
  override isValid(): boolean {
    this.applicationService.currentVersion.Kbi!.SectionStatus[this.index!].InProgress = false;
    this.applicationService.currentVersion.Kbi!.SectionStatus[this.index!].Complete = true;

    this.hasIncompleteData = !KbiValidator.isKbiSectionValid(this.kbiSection);

    return !this.hasIncompleteData;
  }

  override async onSave(): Promise<void> {
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStage.KbiStructureInformationInProgress;
    if (this.applicationService._currentKbiSectionIndex == (this.applicationService.currentVersion.Kbi?.KbiSections.length! - 1)) {
      this.applicationService.model.ApplicationStatus |= BuildingApplicationStage.KbiStructureInformationComplete;
    }

    await this.kbiService.syncBuilding(this.applicationService.currentKbiSection!);
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(`../change-task-list`, this.activatedRoute);
  }

  navigateTo(url: string, group: string, params?: any) {
    let kbiIndex = Number(this.index!) + 1;
    this.navigationService.navigateRelative(`../../kbi/${kbiIndex}/${group}/${url}`, this.activatedRoute, {
      return: ChangeBuildingInformationCheckAnswersComponent.route, ...params
    });
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

}
