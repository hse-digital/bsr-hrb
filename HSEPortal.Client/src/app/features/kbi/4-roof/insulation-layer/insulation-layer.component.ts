import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { RoofMaterialComponent } from '../roof-material/roof-material.component';

@Component({
  selector: 'hse-insulation-layer',
  templateUrl: './insulation-layer.component.html'
})
export class InsulationLayerComponent  extends BaseComponent implements IHasNextPage {
  static route: string = 'roof-insulation';
  static title: string = "Roof insulation - Register a high-rise building - GOV.UK";

  roofInsulationHasErrors = false;
  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  getErrorMessage(){
    return `Select if there is any insulation on any part of the roof on ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  canContinue(): boolean {
    this.roofInsulationHasErrors = !this.applicationService.currenKbiSection!.Roof.RoofInsulation;
    return !this.roofInsulationHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(RoofMaterialComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection?.Roof.RoofType;
  }

}
