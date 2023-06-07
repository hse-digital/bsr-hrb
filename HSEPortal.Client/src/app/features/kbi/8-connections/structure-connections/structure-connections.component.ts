import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent, GovukCheckboxComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, BuildingApplicationStatus } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { OtherHighRiseBuildingConnectionsComponent } from '../other-high-rise-building-connections/other-high-rise-building-connections.component';

@Component({
  selector: 'hse-structure-connections',
  templateUrl: './structure-connections.component.html'
})
export class StructureConnectionsComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'structure-connections';
  static title: string = "How the structures of the building are connected - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  structureConnectionsHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (!this.applicationService.currenKbiSection?.Connections) this.applicationService.currenKbiSection!.Connections = {}
    if (!this.applicationService.currenKbiSection!.Connections.StructureConnections) { this.applicationService.currenKbiSection!.Connections.StructureConnections = []; }
    this.errorMessage = `Select how the structures in ${this.getBuildingName()} are connected`;
  }

  getSubTitle() {
    return `${this.getBuildingName()} is made up of ${this.getAllSectionNames()}`;
  }

  private getAllSectionNames(): string {
    let sections = this.applicationService.model.Sections;
    if (sections.length > 2) {
      return sections.slice(0, sections.length - 1)
        .map(x => x.Name)
        .reduce((a, b) => `${a}, ${b}`)
        ?.concat(' and ', this.applicationService.model.Sections.at(sections.length - 1)!.Name!)!;
    }
    return `${sections[0].Name} and ${sections[1].Name}`;
  }

  getBuildingName() {
    return this.applicationService.model.BuildingName;
  }

  canContinue(): boolean {
    this.structureConnectionsHasErrors = !this.applicationService.currenKbiSection!.Connections.StructureConnections || this.applicationService.currenKbiSection!.Connections.StructureConnections.length == 0;

    if (this.structureConnectionsHasErrors) this.firstCheckboxAnchorId = `bridge-walkway-${this.checkboxes?.first.innerId}`;

    return !this.structureConnectionsHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(OtherHighRiseBuildingConnectionsComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return this.applicationService.model.NumberOfSections != 'one' && this.applicationService.model.Sections.length > 1 
      && this.containsFlag(BuildingApplicationStatus.KbiStructureInformationComplete);
  }

  containsFlag(flag: BuildingApplicationStatus) {
    return (this.applicationService.model.ApplicationStatus & flag) == flag;
  }

}