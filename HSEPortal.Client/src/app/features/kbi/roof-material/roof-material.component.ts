import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { TotalStaircasesComponent } from '../total-staircases/total-staircases.component';

@Component({
  selector: 'hse-roof-material',
  templateUrl: './roof-material.component.html'
})
export class RoofMaterialComponent  extends BaseComponent implements IHasNextPage {
  static route: string = 'roof-material';
  static title: string = "Roof covering - Register a high-rise building - GOV.UK";

  roofMaterialHasErrors = false;
  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }  
  
  getErrorMessage(){
    return `Select what material covers the largest surface area on ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.roofMaterialHasErrors = !this.applicationService.currenKbiSection!.RoofMaterial;
    return !this.roofMaterialHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(TotalStaircasesComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection?.RoofInsulation;
  }

}
