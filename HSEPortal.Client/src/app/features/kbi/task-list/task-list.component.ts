import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApplicationService, BuildingApplicationStatus, KbiModel, KbiSectionModel } from 'src/app/services/application.service';
import { CheckBeforeStartComponent } from '../check-before-start/check-before-start.component';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { KbiNavigation } from 'src/app/features/kbi/kbi.navigation.ts.service';
import { KbiService } from 'src/app/services/kbi.service';

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
    private kbiService: KbiService, private kbiNavigation: KbiNavigation) {
  }

  async ngOnInit() {
    if (!this.applicationService.model.Kbi) {
      this.applicationService.model.Kbi = new KbiModel();
      this.applicationService.model.Sections.forEach(x => {
        var kbiSection = new KbiSectionModel();
        kbiSection.StructureName = x.Name;
        kbiSection.Postcode = x.Addresses[0].Postcode;

        this.applicationService.model.Kbi!.KbiSections.push(kbiSection);
      });

      this.applicationService._currentSectionIndex = 0;
      this.applicationService._currentKbiSectionIndex = 0;
    }

    if (!this.applicationService.model.Kbi.SectionStatus || this.applicationService.model.Kbi.SectionStatus.length == 0) {
      this.applicationService.model.Kbi.SectionStatus = [];
      this.applicationService.model.Sections.map(x => this.applicationService.model.Kbi!.SectionStatus!.push({ InProgress: false, Complete: false }));
    }

    await this.applicationService.updateApplication();
  }

  isSectionInProgress(index: number) {
    return this.applicationService.model.Kbi?.SectionStatus?.at(index)?.InProgress;
  }

  isSectionComplete(index: number) {
    return index < 0
      ? this.containsFlag(BuildingApplicationStatus.KbiCheckBeforeComplete)
      : this.applicationService.model.Kbi?.SectionStatus?.at(index)?.Complete;
  }

  getNumberOfCompletedSteps() {
    let numberCompletedSteps = 0;
    if (this.containsFlag(BuildingApplicationStatus.KbiCheckBeforeComplete)) numberCompletedSteps++;
    if (this.containsFlag(BuildingApplicationStatus.KbiConnectionsComplete)) numberCompletedSteps++;
    if (this.containsFlag(BuildingApplicationStatus.KbiSubmitComplete)) numberCompletedSteps++;
    numberCompletedSteps += this.applicationService.model.Kbi?.SectionStatus?.filter(x => x.Complete).length ?? 0;
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

  async navigateToSection(index: number, sectionName: string) {
    let route = this.kbiNavigation.getNextRoute();

    await this.kbiService.startKbi(this.applicationService.model.Kbi!.KbiSections[index]);
    await this.navigationService.navigateAppend(`${index + 1}-${sectionName}/${route}`, this.activatedRoute);
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
