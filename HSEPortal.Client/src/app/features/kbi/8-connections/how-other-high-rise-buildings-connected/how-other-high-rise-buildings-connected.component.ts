import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent, GovukCheckboxComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'hse-how-other-high-rise-buildings-connected',
  templateUrl: './how-other-high-rise-buildings-connected.component.html',
})
export class HowOtherHighRiseBuildingsConnectedComponent  extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'how-high-rise-buildings-are-connected';
  static title: string = "How it's connected to other high-rise residential buildings - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  howHighRiseBuildingsAreConnectedHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection?.Connections) this.applicationService.currenKbiSection!.Connections = {}
    if (!this.applicationService.currenKbiSection!.Connections.HowOtherHighRiseBuildingAreConnected) { this.applicationService.currenKbiSection!.Connections.HowOtherHighRiseBuildingAreConnected = []; }
    this.errorMessage = `Select what connects ${this.getBuildingName()} to other high-rise residential buildings`;
  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }

  canContinue(): boolean {
    this.howHighRiseBuildingsAreConnectedHasErrors = !this.applicationService.currenKbiSection!.Connections.HowOtherHighRiseBuildingAreConnected || this.applicationService.currenKbiSection!.Connections.HowOtherHighRiseBuildingAreConnected.length == 0;

    if (this.howHighRiseBuildingsAreConnectedHasErrors) this.firstCheckboxAnchorId = `bridge-walkway-${this.checkboxes?.first.innerId}`;

    return !this.howHighRiseBuildingsAreConnectedHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(HowOtherHighRiseBuildingsConnectedComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
  }
}
