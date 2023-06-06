import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { CertificatesYearChangeComponent } from '../certificates-year-change/certificates-year-change.component';

@Component({
  selector: 'hse-previous-use-building',
  templateUrl: './previous-use-building.component.html'
})
export class PreviousUseBuildingComponent  extends BaseComponent implements IHasNextPage {
  static route: string = 'previous-primary-use';
  static title: string = "Previous primary use - Register a high-rise building - GOV.UK";

  previousUseBuildingHasErrors = false;
  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }  
  
  getErrorMessage(){
    return `Select the previous primary use of ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.previousUseBuildingHasErrors = !this.applicationService.currenKbiSection?.BuildingUse.PreviousUseBuilding || this.applicationService.currenKbiSection?.BuildingUse.PreviousUseBuilding.length == 0;
    return !this.previousUseBuildingHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(CertificatesYearChangeComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection?.BuildingUse.ChangePrimaryUse && this.applicationService.currenKbiSection?.BuildingUse.ChangePrimaryUse === "yes";
  }

}
