import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, BuildingApplicationStatus, KbiModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

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

    if (!this.applicationService.currenKbiSection!.PrimaryUseOfBuilding) { this.applicationService.currenKbiSection!.PrimaryUseOfBuilding = ""; }

    this.errorMessage = `Select the primary use for ${this.getInfraestructureName()}`;
  }

  getInfraestructureName(){
    return this.applicationService.model.NumberOfSections === 'one' 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.primaryUseOfBuildingHasErrors = !this.applicationService.currenKbiSection?.PrimaryUseOfBuilding || this.applicationService.currenKbiSection?.PrimaryUseOfBuilding === "";
    return !this.primaryUseOfBuildingHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(PrimaryUseOfBuildingComponent.route, activatedRoute); //TODO route with next page
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {

    return !!this.applicationService.currenKbiSection!.ExternalFeatures && this.applicationService.currenKbiSection!.ExternalFeatures!.length > 0
  }
}
