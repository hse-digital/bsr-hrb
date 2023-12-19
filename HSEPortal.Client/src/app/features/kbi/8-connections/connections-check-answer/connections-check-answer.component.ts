import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, BuildingApplicationStage, SectionModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { StructureConnectionsComponent } from '../structure-connections/structure-connections.component';
import { OtherHighRiseBuildingConnectionsComponent } from '../other-high-rise-building-connections/other-high-rise-building-connections.component';
import { HowOtherHighRiseBuildingsConnectedComponent } from '../how-other-high-rise-buildings-connected/how-other-high-rise-buildings-connected.component';
import { OtherBuildingConnectionsComponent } from '../other-building-connections/other-building-connections.component';
import { HowOtherBuildingsConnectedComponent } from '../how-other-buildings-connected/how-other-buildings-connected.component';
import { FieldValidations } from 'src/app/helpers/validators/fieldvalidations';
import { KbiSubmitModule } from '../../9-submit/kbi.submit.module';
import { DeclarationComponent } from '../../9-submit/declaration/declaration.component';

@Component({
  selector: 'hse-connections-check-answer',
  templateUrl: './connections-check-answer.component.html'
})
export class ConnectionsCheckAnswerComponent  extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'check-answers-connections';
  static title: string = "Check your answers about connections - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  InScopeStructures?: SectionModel[];

  async ngOnInit() {
    this.InScopeStructures = this.applicationService.currentVersion.Sections.filter( x=> !x.Scope?.IsOutOfScope);
  }

  hasIncompleteData = false;
  canContinue(): boolean {
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

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    this.applicationService.model.ApplicationStatus |= BuildingApplicationStage.KbiConnectionsComplete;
    return navigationService.navigateRelative(`../${KbiSubmitModule.baseRoute}/${DeclarationComponent.route}`, activatedRoute);
  }

  override async onSave(): Promise<void> {
    this.applicationService.model.ApplicationStatus = this.applicationService.model.ApplicationStatus | BuildingApplicationStage.KbiConnectionsComplete;
    await this.applicationService.syncBuildingStructures();
  }

  override canAccess(_: ActivatedRouteSnapshot): boolean {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStage.KbiConnectionsInProgress) == BuildingApplicationStage.KbiConnectionsInProgress;
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
    this.navigationService.navigateRelative(route, this.activatedRoute, {
      return: ConnectionsCheckAnswerComponent.route
    }); 
  }

  hasOtherHighRiseBuildingConnections() {
    return this.applicationService.currentKbiModel?.Connections?.OtherHighRiseBuildingConnections === 'yes' ?? false;
  }

  hasOtherBuildingConnections() {
    return this.applicationService.currentKbiModel?.Connections?.OtherBuildingConnections === 'yes' ?? false;
  }

}