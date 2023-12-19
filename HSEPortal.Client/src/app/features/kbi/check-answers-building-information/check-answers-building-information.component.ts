import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, BuildingApplicationStage, KbiSectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { KbiCheckAnswersModule } from './kbi.check-answers-building-information.module';
import { KbiNavigation } from '../kbi.navigation.ts.service';
import { StructureConnectionsComponent } from '../8-connections/structure-connections/structure-connections.component';
import { OtherHighRiseBuildingConnectionsComponent } from '../8-connections/other-high-rise-building-connections/other-high-rise-building-connections.component';
import { KbiConnectionsModule } from '../8-connections/kbi.connections.module';
import { KbiService } from 'src/app/services/kbi.service';
import { KbiValidator } from 'src/app/helpers/kbi-validator'
import { KbiFireModule } from '../1-fire/kbi.fire.module';
import { EvacuationStrategyComponent } from '../1-fire/evacuation-strategy/evacuation-strategy.component';
import { ChangeBuildingInformationCheckAnswersComponent } from '../../registration-amendments/change-kbi/check-answers-building-information/check-answers-building-information.component';
import { KbiChangeCheckAnswersModule } from '../../registration-amendments/change-kbi/check-answers-building-information/kbi.check-answers-building-information.module';

@Component({
  templateUrl: './check-answers-building-information.component.html',
  styleUrls: ['./check-answers-building-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BuildingInformationCheckAnswersComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'check-answers-building-information';
  static title: string = "Check your building information answers - Register a high-rise building - GOV.UK";

  kbiSection: KbiSectionModel = new KbiSectionModel;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, private kbiNavigation: KbiNavigation,
    private kbiService: KbiService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (this.applicationService.model.RegistrationAmendmentsModel?.KbiChangeTaskList) {
      this.applicationService.model.RegistrationAmendmentsModel.KbiChangeTaskList = false;
      this.navigationService.navigateRelative(`../../../registration-amendments/${KbiChangeCheckAnswersModule.baseRoute}/${ChangeBuildingInformationCheckAnswersComponent.route}`, this.activatedRoute, {
        index: this.applicationService._currentKbiSectionIndex
      });
    }
    this.kbiSection = this.applicationService.currentKbiSection!;
  }

  hasIncompleteData = false;
  canContinue(): boolean {
    this.applicationService.currentVersion.Kbi!.SectionStatus[this.applicationService._currentKbiSectionIndex].InProgress = false;
    this.applicationService.currentVersion.Kbi!.SectionStatus[this.applicationService._currentKbiSectionIndex].Complete = true;

    this.hasIncompleteData = !KbiValidator.isKbiSectionValid(this.applicationService.currentKbiSection);

    return !this.hasIncompleteData;
  }

  override async onSave(): Promise<void> {
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStage.KbiStructureInformationInProgress;
    if (this.applicationService._currentKbiSectionIndex == (this.applicationService.currentVersion.Kbi?.KbiSections.length! - 1)) {
      this.applicationService.model.ApplicationStatus |= BuildingApplicationStage.KbiStructureInformationComplete;
    }

    await this.kbiService.syncBuilding(this.applicationService.currentKbiSection!);
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let InScopeStructures = this.applicationService.currentVersion.Sections.filter(x => !x.Scope?.IsOutOfScope);
    if (this.allKbiSectionCompleted()) {
      if (InScopeStructures.length == 1) {
        return navigationService.navigateRelative(`../../${KbiConnectionsModule.baseRoute}/${OtherHighRiseBuildingConnectionsComponent.route}`, activatedRoute);
      }

      return navigationService.navigateRelative(`../../${KbiConnectionsModule.baseRoute}/${StructureConnectionsComponent.route}`, activatedRoute);
    }

    let nextSectionIndex = this.applicationService._currentKbiSectionIndex + 1;
    let sectionRoute = (nextSectionIndex + 1).toString();
    let nextSection = InScopeStructures[nextSectionIndex];
    if (nextSection.Name !== void 0) {
      sectionRoute = `${sectionRoute}-${nextSection.Name}`;
    }

    return this.navigationService.navigateRelative(`../../${sectionRoute}/${KbiFireModule.baseRoute}/${EvacuationStrategyComponent.route}`, this.activatedRoute);
  }

  private allKbiSectionCompleted() {
    return this.applicationService.currentVersion.Kbi!.SectionStatus.map(x => x.Complete).reduce((a, b) => a && b);
  }

  override canAccess(_: ActivatedRouteSnapshot): boolean {
    return true;
  }

  navigateTo(url: string, group: string, params?: any) {
    this.navigateWithReturn(`../${group}/${url}`, params);
  }

  private navigateWithReturn(url: string, params?: any) {
    let query = {
      return: `../${KbiCheckAnswersModule.baseRoute}/${BuildingInformationCheckAnswersComponent.route}`,
      ...params
    };

    this.navigationService.navigateRelative(url, this.activatedRoute, query);
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }
}
