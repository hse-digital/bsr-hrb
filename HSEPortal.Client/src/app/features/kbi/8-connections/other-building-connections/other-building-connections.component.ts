import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { HowOtherBuildingsConnectedComponent } from '../how-other-buildings-connected/how-other-buildings-connected.component';
import { ConnectionsCheckAnswerComponent } from '../connections-check-answer/connections-check-answer.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-other-building-connections',
  templateUrl: './other-building-connections.component.html'
})
export class OtherBuildingConnectionsComponent extends PageComponent<string> {
  static route: string = 'other-building-connection';
  static title: string = "Connections to other buildings - Register a high-rise building - GOV.UK";

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  otherBuildingConnectionsHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiModel?.Connections) this.applicationService.currentKbiModel!.Connections = {}
    this.errorMessage = `Select whether ${this.getBuildingName()} is connected to any other buildings`;
    this.model = this.applicationService.currentKbiModel!.Connections.OtherBuildingConnections;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiModel!.Connections.OtherBuildingConnections = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    let notOtherHighRiseBuildingConnections = FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentKbiModel!.Connections.OtherHighRiseBuildingConnections) 
      && this.applicationService.currentKbiModel!.Connections.OtherHighRiseBuildingConnections === "no";
    let thereAreOtherHighRiseBuildingConnections = !!this.applicationService.currentKbiModel?.Connections.HowOtherHighRiseBuildingAreConnected 
      && this.applicationService.currentKbiModel?.Connections.HowOtherHighRiseBuildingAreConnected.length > 0;
    return notOtherHighRiseBuildingConnections || thereAreOtherHighRiseBuildingConnections;
  }

  override isValid(): boolean {
    this.otherBuildingConnectionsHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.model);

    return !this.otherBuildingConnectionsHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    if(this.applicationService.currentKbiModel!.Connections.OtherBuildingConnections === "yes") {
      return this.navigationService.navigateRelative(HowOtherBuildingsConnectedComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(ConnectionsCheckAnswerComponent.route, this.activatedRoute);
  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }

}
