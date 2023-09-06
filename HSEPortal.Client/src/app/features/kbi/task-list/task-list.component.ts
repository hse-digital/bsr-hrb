import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
import { ApplicationService, BuildingApplicationStage, SectionModel } from 'src/app/services/application.service';
import { CheckBeforeStartComponent } from '../check-before-start/check-before-start.component';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { KbiNavigation } from 'src/app/features/kbi/kbi.navigation.ts.service';
import { KbiService } from 'src/app/services/kbi.service';
import { KbiConnectionsModule } from '../8-connections/kbi.connections.module';
import { KbiSubmitModule } from '../9-submit/kbi.submit.module';

@Component({
  selector: 'hse-task-list',
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements CanActivate, OnInit {
  public static route: string = "";
  static title: string = "Task list - KBI - Register a high-rise building - GOV.UK";

  applicationStatus = BuildingApplicationStage;
  checkingStatus = true;

  InScopeSections!: SectionModel[];

  constructor(public applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute,
    private kbiService: KbiService, private kbiNavigation: KbiNavigation) {
  }

  async ngOnInit() {
    this.applicationService.initKbi();
    this.InScopeSections = this.applicationService.model.Sections.filter(x => !x.Scope?.IsOutOfScope);
    await this.applicationService.updateApplication();
  }

  isSectionInProgress(index: number) {
    return this.applicationService.model.Kbi?.SectionStatus?.at(index)?.InProgress;
  }

  isSectionComplete(index: number) {
    return index < 0 || this.applicationService.model.Kbi?.SectionStatus?.at(index)?.Complete;
  }

  getNumberOfCompletedSteps() {
    let numberCompletedSteps = 0;
    if (this.containsFlag(BuildingApplicationStage.KbiCheckBeforeComplete)) numberCompletedSteps++;
    if (this.containsFlag(BuildingApplicationStage.KbiConnectionsComplete)) numberCompletedSteps++;
    if (this.containsFlag(BuildingApplicationStage.KbiSubmitComplete)) numberCompletedSteps++;
    numberCompletedSteps += this.applicationService.model.Kbi?.SectionStatus?.filter(x => x.Complete).length ?? 0;
    return numberCompletedSteps;
  }

  getSectionName(index: number) {
    return this.InScopeSections.length == 1
      ? this.applicationService.model.BuildingName
      : this.applicationService.model.Kbi?.KbiSections[index].StructureName;
  }

  navigateToCheckBeforeStart() {
    return this.navigationService.navigateAppend(CheckBeforeStartComponent.route, this.activatedRoute);
  }

  async navigateToSection(index: number, sectionName: string) {
    let route = this.kbiNavigation.getNextRoute(index);
    await this.kbiService.startKbi(this.applicationService.model.Kbi!.KbiSections[index]);

    let sectionId = `${index + 1}`;
    if (sectionName !== void 0) {
      sectionId = `${sectionId}-${sectionName}`;
    }

    if (route.startsWith(KbiConnectionsModule.baseRoute) || route.startsWith(KbiSubmitModule.baseRoute)) {
      await this.navigationService.navigateAppend(`${route}`, this.activatedRoute);
    } else {
      let query = route.split('?');
      let params: any = {};
      if (query.length > 1) {
        let queryParam = query[1].split('=');
        params[queryParam[0]] = queryParam[1];
      }

      await this.navigationService.navigateAppend(`${sectionId}/${query[0]}`, this.activatedRoute, params);
    }
  }

  async navigateToConnections() {
    var route = await this.kbiNavigation.getNextConnectionRoute();
    await this.navigationService.navigateAppend(route, this.activatedRoute);
  }

  async navigateToSubmit() {
    var route = await this.kbiNavigation.getNextSubmitRoute();
    await this.navigationService.navigateAppend(route, this.activatedRoute);
  }

  isKbiCheckBeforeComplete() {
    return this.containsFlag(BuildingApplicationStage.KbiCheckBeforeComplete);
  }
  
  containsFlag(flag: BuildingApplicationStage) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let canActivate = this.applicationService.model.PaymentInvoiceDetails?.Status == 'awaiting' || this.applicationService.model.PaymentInvoiceDetails?.Status == 'completed' || (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.PaymentComplete) == BuildingApplicationStage.PaymentComplete;
    if (!canActivate) {
      this.navigationService.navigate(NotFoundComponent.route);
      return false;
    }
    return true;
  }

}
