import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, BuildingApplicationStatus, KbiModel } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'hse-evacuation-strategy',
  templateUrl: './evacuation-strategy.component.html'
})
export class EvacuationStrategyComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'evacuation-strategy';
  static title: string = "Evacuation strategy - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  errorMessage?: string;

  evacuationStrategyHasErrors = false;
  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.applicationService.model.Kbi!.SectionStatus[this.applicationService._currentKbiSectionIndex].inProgress = true;
    this.errorMessage = `Select the strategy you use to evacuate the residential part of ${this.getInfraestructureName()}`;
  }

  getInfraestructureName(){
    return this.applicationService.model.NumberOfSections === 'one' 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.evacuationStrategyHasErrors = !this.applicationService.currenKbiSection?.strategyEvacuateBuilding;
    return !this.evacuationStrategyHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(EvacuationStrategyComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return (this.applicationService.model.ApplicationStatus & BuildingApplicationStatus.KbiCheckBeforeComplete) == BuildingApplicationStatus.KbiCheckBeforeComplete;
  }
}