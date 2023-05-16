import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApplicationService, BuildingApplicationStatus, KbiModel, KbiSectionModel } from 'src/app/services/application.service';
import { CheckBeforeStartComponent } from '../check-before-start/check-before-start.component';
import { EvacuationStrategyComponent } from '../evacuation-strategy/evacuation-strategy.component';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { KbiNavigation } from 'src/app/services/navigation/kbi.navigation.ts.service';

@Component({
  selector: 'hse-task-list',
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements CanActivate, OnInit {
  public static route: string = "";
  static title: string = "Task list - KBI - Register a high-rise building - GOV.UK";

  applicationStatus = BuildingApplicationStatus;
  checkingStatus = true;

  constructor(public applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute,
    private kbiNavigation: KbiNavigation) {

  }

  ngOnInit(): void {
    if (!this.applicationService.model.Kbi) {
      this.applicationService.model.Kbi = new KbiModel();
      this.applicationService.model.Sections.forEach(x => this.applicationService.model.Kbi!.KbiSections.push(new KbiSectionModel()));
      this.applicationService._currentSectionIndex = 0;
    }
    if (!this.applicationService.model.Kbi.SectionStatus || this.applicationService.model.Kbi.SectionStatus.length == 0) {
      this.applicationService.model.Kbi.SectionStatus = [];
      this.applicationService.model.Sections.map(x => this.applicationService.model.Kbi!.SectionStatus!.push({ inProgress: false, complete: false }));
    }
  }

  isSectionInProgress(index: number) {
    return this.applicationService.model.Kbi?.SectionStatus?.at(index)?.inProgress;
  }

  isSectionComplete(index: number) {
    return index < 0
      ? this.containsFlag(BuildingApplicationStatus.KbiCheckBeforeComplete)
      : this.applicationService.model.Kbi?.SectionStatus?.at(index)?.complete;
  }

  getNumberOfCompletedSteps() {
    let numberCompletedSteps = 0;
    if (this.containsFlag(BuildingApplicationStatus.KbiCheckBeforeComplete)) numberCompletedSteps++;
    if (this.containsFlag(BuildingApplicationStatus.KbiConnectionsComplete)) numberCompletedSteps++;
    if (this.containsFlag(BuildingApplicationStatus.KbiSubmitComplete)) numberCompletedSteps++;
    numberCompletedSteps += this.applicationService.model.Kbi?.SectionStatus?.filter(x => x.complete).length ?? 0;
    return numberCompletedSteps;
  }

  getSectionName(index: number) {
    return this.applicationService.model.Sections.length == 1
      ? this.applicationService.model.BuildingName
      : this.applicationService.model.Sections[index].Name;
  }

  navigateToCheckBeforeStart() {
    return this.navigationService.navigateAppend(CheckBeforeStartComponent.route, this.activatedRoute);
  }

  async navigateToSection(index: number) {
    this.applicationService._currentKbiSectionIndex = index;
    return this.navigateToKbiSections();
  }

  async navigateToKbiSections() {
    const route = this.kbiNavigation.getNextRoute();
    if (route.indexOf('?') > -1) {
      let segments = route.split('?');
      let equipment = segments[1].substring(segments[1].indexOf('=') + 1);
      await this.navigationService.navigateAppend(segments[0], this.activatedRoute, { equipment: equipment });
    } else {
      await this.navigationService.navigateAppend(route, this.activatedRoute);
    }
  }

  navigateToConnections() {

  }

  navigateToSubmit() {

  }

  containsFlag(flag: BuildingApplicationStatus) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let canActivate = (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete;
    if (!canActivate) {
      this.navigationService.navigate(NotFoundComponent.route);
      return false;
    }
    return true;
  }

}
