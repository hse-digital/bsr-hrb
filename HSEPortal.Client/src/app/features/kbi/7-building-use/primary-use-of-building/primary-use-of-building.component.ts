import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { SecondaryUseBuildingComponent } from '../secondary-use-building/secondary-use-building.component';
import { KbiService } from 'src/app/services/kbi.service';

@Component({
  selector: 'hse-primary-use-of-building',
  templateUrl: './primary-use-of-building.component.html'
})
export class PrimaryUseOfBuildingComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'primary-use-of-building';
  static title: string = "Primary Use - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  errorMessage?: string;

  primaryUseOfBuildingHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, private kbiService: KbiService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  async ngOnInit() {
    if(!this.applicationService.currentKbiSection?.BuildingUse) this.applicationService.currentKbiSection!.BuildingUse = {}
    if (!this.applicationService.currentKbiSection!.BuildingUse.PrimaryUseOfBuilding) { this.applicationService.currentKbiSection!.BuildingUse.PrimaryUseOfBuilding = ""; }

    this.errorMessage = `Select the primary use for ${this.getInfraestructureName()}`;

    await this.kbiService.syncStructureRoofStaircasesAndWalls(this.applicationService.currentKbiSection!);
  }

  getInfraestructureName(){
    return this.applicationService.model.NumberOfSections === 'one' 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.primaryUseOfBuildingHasErrors = !this.applicationService.currentKbiSection?.BuildingUse.PrimaryUseOfBuilding || this.applicationService.currentKbiSection?.BuildingUse.PrimaryUseOfBuilding === "";
    return !this.primaryUseOfBuildingHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(SecondaryUseBuildingComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {

    return !!this.applicationService.currentKbiSection!.Walls.ExternalFeatures && this.applicationService.currentKbiSection!.Walls.ExternalFeatures!.length > 0
  }
}
