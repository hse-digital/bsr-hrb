import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent, GovukCheckboxComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';

@Component({
  selector: 'hse-other-high-rise-building-connections',
  templateUrl: './other-high-rise-building-connections.component.html'
})
export class OtherHighRiseBuildingConnectionsComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'other-building-connections';
  static title: string = "Connections to other high-rise residential buildings - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  otherHighRiseBuildingConnectionsHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection?.Connections) this.applicationService.currenKbiSection!.Connections = {}
    this.errorMessage = `Select whether ${this.getBuildingName()} connects to other high-rise residential buildings`;
  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }

  canContinue(): boolean {
    this.otherHighRiseBuildingConnectionsHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.applicationService.currenKbiSection!.Connections.OtherHighRiseBuildingConnections);

    return !this.otherHighRiseBuildingConnectionsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(OtherHighRiseBuildingConnectionsComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return true;
  }

}