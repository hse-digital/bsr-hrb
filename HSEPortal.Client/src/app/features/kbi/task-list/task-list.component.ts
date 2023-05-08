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
      { Name: "name", Addresses: [new AddressModel()] },
      { Name: "name2", Addresses: [new AddressModel()] },
    ]
    this.applicationService.model.Sections.map(x => this.sectionStatus.push({ inProgress: false, complete: false }));
  }

  isSectionInProgress(index: number) {
    return this.sectionStatus[index].inProgress;
  }

  isSectionComplete(index: number) {
    return this.sectionStatus[index].complete;
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
