import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxComponent } from 'hse-angular';
import { ApplicationService, BuildingApplicationStage } from 'src/app/services/application.service';
import { OtherHighRiseBuildingConnectionsComponent } from '../other-high-rise-building-connections/other-high-rise-building-connections.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-structure-connections',
  templateUrl: './structure-connections.component.html'
})
export class StructureConnectionsComponent extends PageComponent<string[]> {
  static route: string = 'structure-connections';
  static title: string = "How the structures of the building are connected - Register a high-rise building - GOV.UK";

  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  structureConnectionsHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override async onInit(applicationService: ApplicationService): Promise<void> {
    if (!this.applicationService.currentKbiModel?.Connections) {
      this.applicationService.currentKbiModel!.Connections = {};
    }

    if (!this.applicationService.currentKbiModel!.Connections.StructureConnections) {
      this.applicationService.currentKbiModel!.Connections.StructureConnections = [];
    }

    this.applicationService.model.ApplicationStatus |= BuildingApplicationStage.KbiConnectionsInProgress;
    await this.applicationService.updateApplication();
    
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiModel!.Connections.StructureConnections);

    this.errorMessage = `Select how the structures in ${this.getBuildingName()} are connected`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiModel!.Connections.StructureConnections = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  override isValid(): boolean {
    this.structureConnectionsHasErrors = !this.model || this.model?.length == 0;

    if (this.structureConnectionsHasErrors) this.firstCheckboxAnchorId = `bridge-walkway-${this.checkboxes?.first.innerId}`;

    return !this.structureConnectionsHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    return this.navigationService.navigateRelative(OtherHighRiseBuildingConnectionsComponent.route, this.activatedRoute);
  }

  getSubTitle() {
    return `${this.getBuildingName()} is made up of ${this.getAllSectionNames()}`;
  }

  private getAllSectionNames(): string {
    let InScopeStructures = this.applicationService.currentVersion.Sections.filter(x => !x.Scope?.IsOutOfScope);
    let sections = InScopeStructures;
    if (sections.length > 2) {
      return sections.slice(0, sections.length - 1)
        .map(x => x.Name)
        .reduce((a, b) => `${a}, ${b}`)
        ?.concat(' and ', InScopeStructures.at(sections.length - 1)!.Name!)!;
    }
    return `${sections[0].Name} and ${sections[1].Name}`;
  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }

  containsFlag(flag: BuildingApplicationStage) {
    return true;
  }

}