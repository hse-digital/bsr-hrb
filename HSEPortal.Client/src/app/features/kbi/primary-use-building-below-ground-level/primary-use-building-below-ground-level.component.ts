import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'hse-primary-use-building-below-ground-level',
  templateUrl: './primary-use-building-below-ground-level.component.html'
})
export class PrimaryUseBuildingBelowGroundLevelComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'primary-use-floors-below-ground-level';
  static title: string = "Primary use of floors below ground level - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  errorMessage?: string;
  primaryUseBuildingBelowGroundLevelHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.errorMessage = `Select the primary use of the floors below ground level in ${this.getInfraestructureName()}`;
  }

  getInfraestructureName(){
    return this.applicationService.model.NumberOfSections === 'one' 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.primaryUseBuildingBelowGroundLevelHasErrors = !!this.applicationService.currenKbiSection?.PrimaryUseBuildingBelowGroundLevel && this.applicationService.currenKbiSection?.PrimaryUseBuildingBelowGroundLevel.length > 0;
    return !this.primaryUseBuildingBelowGroundLevelHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(PrimaryUseBuildingBelowGroundLevelComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection?.FloorsBelowGroundLevel && this.applicationService.currenKbiSection?.FloorsBelowGroundLevel > 0;
  }

}
