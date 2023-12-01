import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { HowOtherBuildingsConnectedComponent } from 'src/app/features/kbi/8-connections/how-other-buildings-connected/how-other-buildings-connected.component';
import { HowOtherHighRiseBuildingsConnectedComponent } from 'src/app/features/kbi/8-connections/how-other-high-rise-buildings-connected/how-other-high-rise-buildings-connected.component';
import { OtherBuildingConnectionsComponent } from 'src/app/features/kbi/8-connections/other-building-connections/other-building-connections.component';
import { OtherHighRiseBuildingConnectionsComponent } from 'src/app/features/kbi/8-connections/other-high-rise-building-connections/other-high-rise-building-connections.component';
import { StructureConnectionsComponent } from 'src/app/features/kbi/8-connections/structure-connections/structure-connections.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { ApplicationService, SectionModel, Status } from 'src/app/services/application.service';
import { ChangeTaskListComponent } from '../../change-task-list/change-task-list.component';
import { ChangeConnectionsHelper } from 'src/app/helpers/registration-amendments/change-connections-helper';

@Component({
  selector: 'hse-change-connections',
  templateUrl: './change-connections.component.html'
})
export class ChangeConnectionsComponent extends PageComponent<void> {
  static route: string = 'change-connection-answers';
  static title: string = "Check your answers about connections - Register a high-rise building - GOV.UK";

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
    this.updateConnectionStatus();
  }

  private updateConnectionStatus() {
    let missingAnswer = !this.applicationService.currentVersion.Kbi!.Connections.StructureConnections || this.applicationService.currentVersion.Kbi!.Connections.StructureConnections.length == 0;
    if (this.applicationService.model.NumberOfSections != "one" && missingAnswer) {
      this.applicationService.currentVersion.Kbi!.Connections.Status = Status.ChangesInProgress;
    } else if(new ChangeConnectionsHelper(this.applicationService)?.getChanges().length! > 0) {
      this.applicationService.currentVersion.Kbi!.Connections.Status = this.isValid() 
        ? Status.ChangesComplete 
        : Status.ChangesInProgress;
    } else {
      this.applicationService.currentVersion.Kbi!.Connections.Status = Status.NoChanges;
    }
  }

  InScopeStructures?: SectionModel[];

  hasIncompleteData = false;
  override isValid(): boolean {
    let canContinue = true;
    let InScopeStructures = this.applicationService.currentVersion.Sections.filter(x => !x.Scope?.IsOutOfScope);
    if (InScopeStructures.length > 1) canContinue &&= !!this.applicationService.currentKbiModel?.Connections?.StructureConnections && this.applicationService.currentKbiModel?.Connections?.StructureConnections.length > 0;
    
    canContinue &&= FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentKbiModel?.Connections?.OtherHighRiseBuildingConnections); 
    
    if(this.applicationService.currentKbiModel?.Connections?.OtherHighRiseBuildingConnections === 'yes') canContinue &&= !!this.applicationService.currentKbiModel?.Connections?.HowOtherHighRiseBuildingAreConnected && this.applicationService.currentKbiModel?.Connections?.HowOtherHighRiseBuildingAreConnected.length > 0;
    
    canContinue &&= FieldValidations.IsNotNullOrWhitespace(this.applicationService.currentKbiModel?.Connections?.OtherBuildingConnections); 
    
    if(this.applicationService.currentKbiModel?.Connections?.OtherBuildingConnections === 'yes') canContinue &&= !!this.applicationService.currentKbiModel?.Connections?.HowOtherBuildingAreConnected && this.applicationService.currentKbiModel?.Connections?.HowOtherBuildingAreConnected.length > 0;

    this.hasIncompleteData = !canContinue;
    return canContinue;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(ChangeTaskListComponent.route, this.activatedRoute);
  }

  override async onSave(): Promise<void> {
    
  }

  navigateToStructureConnections() {
    this.navigateTo(StructureConnectionsComponent.route);
  }

  navigateToOtherHighRiseBuildingConnections() {
    this.navigateTo(OtherHighRiseBuildingConnectionsComponent.route);
  }

  navigateToHowOtherHighRiseBuildingsConnected() {
    this.navigateTo(HowOtherHighRiseBuildingsConnectedComponent.route);
  }

  navigateToOtherBuildingConnections() {
    this.navigateTo(OtherBuildingConnectionsComponent.route);
  }

  navigateToHowOtherBuildingsConnected() {
    this.navigateTo(HowOtherBuildingsConnectedComponent.route);
  }

  private navigateTo(route: string) {
    this.navigationService.navigateRelative(`../kbi/connections/${route}`, this.activatedRoute, {
      return: `${ChangeConnectionsComponent.route}`
    }); 
  }

  hasOtherHighRiseBuildingConnections() {
    return this.applicationService.currentKbiModel?.Connections?.OtherHighRiseBuildingConnections === 'yes' ?? false;
  }

  hasOtherBuildingConnections() {
    return this.applicationService.currentKbiModel?.Connections?.OtherBuildingConnections === 'yes' ?? false;
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override onInit(applicationService: ApplicationService): void | Promise<void> {
    this.InScopeStructures = this.applicationService.currentVersion.Sections.filter( x=> !x.Scope?.IsOutOfScope && x.Status != Status.Removed);
  }

}
