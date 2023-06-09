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
import { ConnectionsCheckAnswerComponent } from '../connections-check-answer/connections-check-answer.component';

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
    if (!this.applicationService.currentKbiModel?.Connections) this.applicationService.currentKbiModel!.Connections = {}
    this.errorMessage = `Select whether ${this.getBuildingName()} is connected to any other buildings`;
  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }

  canContinue(): boolean {
    this.otherBuildingConnectionsHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentKbiModel!.Connections.OtherBuildingConnections);

    return !this.otherBuildingConnectionsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if(this.applicationService.currentKbiModel!.Connections.OtherBuildingConnections === "yes") {
      return navigationService.navigateRelative(HowOtherBuildingsConnectedComponent.route, activatedRoute);
    }
    return navigationService.navigateRelative(ConnectionsCheckAnswerComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    let notOtherHighRiseBuildingConnections = FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentKbiModel!.Connections.OtherHighRiseBuildingConnections) 
      && this.applicationService.currentKbiModel!.Connections.OtherHighRiseBuildingConnections === "no";
    let thereAreOtherHighRiseBuildingConnections = !!this.applicationService.currentKbiModel?.Connections.HowOtherHighRiseBuildingAreConnected 
      && this.applicationService.currentKbiModel?.Connections.HowOtherHighRiseBuildingAreConnected.length > 0;
    return notOtherHighRiseBuildingConnections || thereAreOtherHighRiseBuildingConnections;
  }

}
