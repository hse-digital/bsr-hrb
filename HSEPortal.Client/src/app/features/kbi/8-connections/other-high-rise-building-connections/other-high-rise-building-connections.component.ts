import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { HowOtherHighRiseBuildingsConnectedComponent } from '../how-other-high-rise-buildings-connected/how-other-high-rise-buildings-connected.component';
import { OtherBuildingConnectionsComponent } from '../other-building-connections/other-building-connections.component';
import { PageComponent } from 'src/app/helpers/page.component';

@Component({
  selector: 'hse-other-high-rise-building-connections',
  templateUrl: './other-high-rise-building-connections.component.html'
})
export class OtherHighRiseBuildingConnectionsComponent extends PageComponent<string> {
  static route: string = 'other-high-rise-building-connections';
  static title: string = "Connections to other high-rise residential buildings - Register a high-rise building - GOV.UK";

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  otherHighRiseBuildingConnectionsHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if (!this.applicationService.currentKbiModel?.Connections) this.applicationService.currentKbiModel!.Connections = {}
    this.errorMessage = `Select whether ${this.getBuildingName()} connects to other high-rise residential buildings`;
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStatus.KbiConnectionsInProgress;
    
    this.model = applicationService.currentKbiModel!.Connections!.OtherHighRiseBuildingConnections;
    
    await this.applicationService.updateApplication();
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.currentKbiModel!.Connections!.OtherHighRiseBuildingConnections = this.model;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
    //return !!this.applicationService.currentKbiModel?.Connections.StructureConnections && this.applicationService.currentKbiModel!.Connections.StructureConnections.length > 0;
  }

  override isValid(): boolean {
    this.otherHighRiseBuildingConnectionsHasErrors = !FieldValidations.IsNotNullOrWhitespace(this.model);

    return !this.otherHighRiseBuildingConnectionsHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    if(this.applicationService.currentKbiModel!.Connections.OtherHighRiseBuildingConnections === "yes") {
      return this.navigationService.navigateRelative(HowOtherHighRiseBuildingsConnectedComponent.route, this.activatedRoute);
    }
    return this.navigationService.navigateRelative(OtherBuildingConnectionsComponent.route, this.activatedRoute);
  }

}