import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { KbiFireModule } from "../1-fire/kbi.fire.module";
import { EvacuationStrategyComponent } from "../1-fire/evacuation-strategy/evacuation-strategy.component";

@Component({
  selector: 'hse-check-before-start',
  templateUrl: './check-before-start.component.html'
})
export class CheckBeforeStartComponent implements CanActivate, OnInit {
  public static route: string = "check-before-start";
  static title: string = "Check before start - KBI - Register a high-rise building - GOV.UK";

  constructor(private applicationService: ApplicationService, private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {
  }

  async ngOnInit() {
    this.applicationService.initKbi();
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiCheckBeforeInProgress;
    await this.applicationService.updateApplication();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.applicationService.model.PaymentInvoiceDetails!.Status == 'awaiting' || this.applicationService.model.PaymentInvoiceDetails!.Status == 'completed' || (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.PaymentComplete) == BuildingApplicationStatus.PaymentComplete;
  }

  async continue() {
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiCheckBeforeComplete;
    await this.applicationService.updateApplication();

    let section = this.applicationService.model.Sections.filter(x => !x.Scope?.IsOutOfScope)[0];
    let sectionRoute = `1`;
    if (section.Name !== void 0) {
      sectionRoute = `${sectionRoute}-${section.Name}`;
    }

    return this.navigationService.navigateRelative(`${sectionRoute}/${KbiFireModule.baseRoute}/${EvacuationStrategyComponent.route}`, this.activatedRoute);
  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }
}
