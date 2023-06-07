import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { PreviousUseBuildingComponent } from '../previous-use-building/previous-use-building.component';

@Component({
  selector: 'hse-change-primary-use',
  templateUrl: './change-primary-use.component.html'
})
export class ChangePrimaryUseComponent  extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'change-primary-use';
  static title: string = "Change in primary use - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  errorMessage?: string;
  changePrimaryUseHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.errorMessage = `Select whether ${this.getInfraestructureName()} has had a different primary use in the past`;
  }

  getInfraestructureName(){
    return this.applicationService.model.NumberOfSections === 'one' 
      ? this.applicationService.model.BuildingName 
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.changePrimaryUseHasErrors = !this.applicationService.currenKbiSection?.BuildingUse.ChangePrimaryUse || this.applicationService.currenKbiSection?.BuildingUse.ChangePrimaryUse.length == 0;
    return !this.changePrimaryUseHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.applicationService.currenKbiSection?.BuildingUse.ChangePrimaryUse === "yes") {
      return navigationService.navigateRelative(PreviousUseBuildingComponent.route, activatedRoute);  
    }
    return navigationService.navigateRelative(ChangePrimaryUseComponent.route, activatedRoute); // user goes to material changes 937
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection?.BuildingUse.FloorsBelowGroundLevel;
  }

}