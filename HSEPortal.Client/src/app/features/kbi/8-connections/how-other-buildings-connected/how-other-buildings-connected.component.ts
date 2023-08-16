import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxComponent } from 'hse-angular';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService } from 'src/app/services/application.service';
import { ConnectionsCheckAnswerComponent } from '../connections-check-answer/connections-check-answer.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-how-other-buildings-connected',
  templateUrl: './how-other-buildings-connected.component.html'
})
export class HowOtherBuildingsConnectedComponent extends PageComponent<string[]> {
  static route: string = 'how-buildings-are-connected';
  static title: string = "How it's connected to other buildings - Register a high-rise building - GOV.UK";

  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  howBuildingsAreConnectedHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiModel?.Connections) this.applicationService.currentKbiModel!.Connections = {}
    if (!this.applicationService.currentKbiModel!.Connections.HowOtherBuildingAreConnected) { this.applicationService.currentKbiModel!.Connections.HowOtherBuildingAreConnected = []; }
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiModel!.Connections.HowOtherBuildingAreConnected);
    this.errorMessage = `Select what connects ${this.getBuildingName()} to the other buildings`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiModel!.Connections.HowOtherBuildingAreConnected = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentKbiModel!.Connections.OtherBuildingConnections) 
      && this.applicationService.currentKbiModel!.Connections.OtherBuildingConnections === "yes";
  }

  override isValid(): boolean {
    this.howBuildingsAreConnectedHasErrors = !this.model || this.model?.length == 0;

    if (this.howBuildingsAreConnectedHasErrors) this.firstCheckboxAnchorId = `bridge-walkway-${this.checkboxes?.first.innerId}`;

    return !this.howBuildingsAreConnectedHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(ConnectionsCheckAnswerComponent.route, this.activatedRoute);
  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }

}
