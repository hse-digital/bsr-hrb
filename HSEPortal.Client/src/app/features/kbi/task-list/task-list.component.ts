import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';

@Component({
  selector: 'hse-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements CanActivate, OnInit {
  public static route: string = "task-list";
  static title: string = "Task list - KBI - Register a high-rise building - GOV.UK";

  applicationStatus = BuildingApplicationStatus;
  checkingStatus = true;

  constructor(public applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    if(!this.applicationService.model.Kbi?.SectionStatus) {
      this.applicationService.model.Sections.map(x => this.applicationService.model.Kbi?.SectionStatus?.push({ inProgress: false, complete: false }));
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
    if(this.containsFlag(BuildingApplicationStatus.KbiCheckBeforeComplete)) numberCompletedSteps++;
    if(this.containsFlag(BuildingApplicationStatus.KbiConnectionsComplete)) numberCompletedSteps++;
    if(this.containsFlag(BuildingApplicationStatus.KbiSubmitComplete)) numberCompletedSteps++;
    numberCompletedSteps += this.applicationService.model.Kbi?.SectionStatus?.filter(x => x.complete).length ?? 0;
    return numberCompletedSteps;
  }

  getSectionName(index: number) {
    return this.applicationService.model.Sections.length == 1 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.model.Sections[index].Name;
  }

  navigateToCheckBeforeStart() {

  }

  navigateToSection(index: number) {

  }

  navigateToConnections() {

  }

  navigateToSubmit() {

  }

  containsFlag(flag: BuildingApplicationStatus) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true;
  }

  continue() {
    return this.navigationService.navigateRelative(TaskListComponent.route, this.activatedRoute);
  }
}
