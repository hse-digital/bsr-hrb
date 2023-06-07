import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { HowOtherBuildingsConnectedComponent } from '../how-other-buildings-connected/how-other-buildings-connected.component';

@Component({
  selector: 'hse-other-building-connections',
  templateUrl: './other-building-connections.component.html'
})
export class OtherBuildingConnectionsComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'other-building-connection';
  static title: string = "Connections to other buildings - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  otherBuildingConnectionsHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection?.Connections) this.applicationService.currenKbiSection!.Connections = {}
    this.errorMessage = `Select whether ${this.getBuildingName()} is connected to any other buildings`;
  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }

  canContinue(): boolean {
    this.otherBuildingConnectionsHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.applicationService.currenKbiSection!.Connections.OtherBuildingConnections);

    return !this.otherBuildingConnectionsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if(this.applicationService.currenKbiSection!.Connections.OtherBuildingConnections === "yes") {
      return navigationService.navigateRelative(HowOtherBuildingsConnectedComponent.route, activatedRoute);
    }
    return navigationService.navigateRelative(OtherBuildingConnectionsComponent.route, activatedRoute); // user goes to check answer page
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    let notOtherHighRiseBuildingConnections = FieldValidations.IsNotNullOrWhitespace(this.applicationService.currenKbiSection!.Connections.OtherHighRiseBuildingConnections) 
      && this.applicationService.currenKbiSection!.Connections.OtherHighRiseBuildingConnections === "no";
    let thereAreOtherHighRiseBuildingConnections = !!this.applicationService.currenKbiSection?.Connections.HowOtherHighRiseBuildingAreConnected 
      && this.applicationService.currenKbiSection?.Connections.HowOtherHighRiseBuildingAreConnected.length > 0;
    return notOtherHighRiseBuildingConnections || thereAreOtherHighRiseBuildingConnections;
  }

}
