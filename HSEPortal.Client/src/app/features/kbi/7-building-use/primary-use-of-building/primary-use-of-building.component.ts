import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { SecondaryUseBuildingComponent } from '../secondary-use-building/secondary-use-building.component';

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

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if(!this.applicationService.currenKbiSection?.BuildingUse) this.applicationService.currenKbiSection!.BuildingUse = {}
    if (!this.applicationService.currenKbiSection!.BuildingUse.PrimaryUseOfBuilding) { this.applicationService.currenKbiSection!.BuildingUse.PrimaryUseOfBuilding = ""; }

    this.errorMessage = `Select the primary use for ${this.getInfraestructureName()}`;
  }

  getInfraestructureName(){
    return this.applicationService.model.NumberOfSections === 'one' 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.primaryUseOfBuildingHasErrors = !this.applicationService.currenKbiSection?.BuildingUse.PrimaryUseOfBuilding || this.applicationService.currenKbiSection?.BuildingUse.PrimaryUseOfBuilding === "";
    return !this.primaryUseOfBuildingHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(SecondaryUseBuildingComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {

    return !!this.applicationService.currenKbiSection!.Walls.ExternalFeatures && this.applicationService.currenKbiSection!.Walls.ExternalFeatures!.length > 0
  }
}
