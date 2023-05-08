import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApplicationService, BuildingApplicationStatus, SectionModel } from 'src/app/services/application.service';
import { AddressModel } from 'src/app/services/address.service';

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

  sectionStatus: { inProgress: boolean, complete: boolean }[] = []

  constructor(public applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.applicationService.model.Sections = [
      { Name: "Name", Addresses: [new AddressModel()] },
      { Name: "Name2", Addresses: [new AddressModel()] },
      { Name: "Name3", Addresses: [new AddressModel()] },
    ]
    this.applicationService.model.Sections.map(x => this.sectionStatus.push({ inProgress: false, complete: false }));
    
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiCheckBeforeInProgress; 
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiCheckBeforeComplete; 
    this.sectionStatus[0].inProgress = false;
    this.sectionStatus[0].complete = true;
    this.sectionStatus[1].inProgress = false;
    this.sectionStatus[1].complete = true;
    this.sectionStatus[2].inProgress = false;
    this.sectionStatus[2].complete = true;
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiStructureInformationInProgress; 
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiStructureInformationComplete; 
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiConnectionsInProgress; 
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiConnectionsComplete; 
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiSubmitInProgress; 
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiSubmitComplete; 
  }

  isSectionInProgress(index: number) {
    return this.sectionStatus[index].inProgress;
  }

  isSectionComplete(index: number) {
    return index < 0 
      ? this.containsFlag(BuildingApplicationStatus.KbiCheckBeforeComplete) 
      : this.sectionStatus[index].complete;
  }

  getNumberOfCompletedSteps() {
    let numberCompletedSteps = 0;
    if(this.containsFlag(BuildingApplicationStatus.KbiCheckBeforeComplete)) numberCompletedSteps++;
    if(this.containsFlag(BuildingApplicationStatus.KbiConnectionsComplete)) numberCompletedSteps++;
    if(this.containsFlag(BuildingApplicationStatus.KbiSubmitComplete)) numberCompletedSteps++;
    numberCompletedSteps += this.sectionStatus.filter(x => x.complete).length;
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
