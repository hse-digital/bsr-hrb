import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent, GovukCheckboxComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { ConnectionsCheckAnswerComponent } from '../connections-check-answer/connections-check-answer.component';

@Component({
  selector: 'hse-how-other-buildings-connected',
  templateUrl: './how-other-buildings-connected.component.html'
})
export class HowOtherBuildingsConnectedComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'how-buildings-are-connected';
  static title: string = "How it's connected to other buildings - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  howBuildingsAreConnectedHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currentKbiModel?.Connections) this.applicationService.currentKbiModel!.Connections = {}
    if (!this.applicationService.currentKbiModel!.Connections.HowOtherBuildingAreConnected) { this.applicationService.currentKbiModel!.Connections.HowOtherBuildingAreConnected = []; }
    this.errorMessage = `Select what connects ${this.getBuildingName()} to the other buildings`;
  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }

  canContinue(): boolean {
    this.howBuildingsAreConnectedHasErrors = !this.applicationService.currentKbiModel!.Connections.HowOtherBuildingAreConnected || this.applicationService.currentKbiModel!.Connections.HowOtherBuildingAreConnected.length == 0;

    if (this.howBuildingsAreConnectedHasErrors) this.firstCheckboxAnchorId = `bridge-walkway-${this.checkboxes?.first.innerId}`;

    return !this.howBuildingsAreConnectedHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(ConnectionsCheckAnswerComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentKbiModel!.Connections.OtherBuildingConnections) 
      && this.applicationService.currentKbiModel!.Connections.OtherBuildingConnections === "yes";
  }
}
