import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxComponent } from 'hse-angular';
import { CloneHelper } from 'src/app/helpers/array-helper';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { OtherBuildingConnectionsComponent } from '../other-building-connections/other-building-connections.component';

@Component({
  selector: 'hse-how-other-high-rise-buildings-connected',
  templateUrl: './how-other-high-rise-buildings-connected.component.html',
})
export class HowOtherHighRiseBuildingsConnectedComponent  extends PageComponent<string[]> {
  static route: string = 'how-high-rise-buildings-are-connected';
  static title: string = "How it's connected to other high-rise residential buildings - Register a high-rise building - GOV.UK";

  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  howHighRiseBuildingsAreConnectedHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiModel?.Connections) this.applicationService.currentKbiModel!.Connections = {}
    if (!this.applicationService.currentKbiModel!.Connections.HowOtherHighRiseBuildingAreConnected) { this.applicationService.currentKbiModel!.Connections.HowOtherHighRiseBuildingAreConnected = []; }
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiModel!.Connections.HowOtherHighRiseBuildingAreConnected);
    this.errorMessage = `Select what connects ${this.getBuildingName()} to other high-rise residential buildings`;
  }
  
  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiModel!.Connections.HowOtherHighRiseBuildingAreConnected = CloneHelper.DeepCopy(this.model);
  }
  
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentKbiModel!.Connections.OtherHighRiseBuildingConnections) 
      && this.applicationService.currentKbiModel!.Connections.OtherHighRiseBuildingConnections === "yes";
  }
  
  override isValid(): boolean {
    this.howHighRiseBuildingsAreConnectedHasErrors = !this.model || this.model?.length == 0;

    if (this.howHighRiseBuildingsAreConnectedHasErrors) this.firstCheckboxAnchorId = `bridge-walkway-${this.checkboxes?.first.innerId}`;

    return !this.howHighRiseBuildingsAreConnectedHasErrors;
  }
  
  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(OtherBuildingConnectionsComponent.route, this.activatedRoute);
  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }

}
