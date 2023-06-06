import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { InsulationLayerComponent } from '../insulation-layer/insulation-layer.component';

@Component({
  selector: 'hse-roof-type',
  templateUrl: './roof-type.component.html'
})
export class RoofTypeComponent  extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'roof-type';
  static title: string = "Type of roof - Register a high-rise building - GOV.UK";

  roofTypeHasErrors = false;
  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if(!this.applicationService.currenKbiSection?.Roof) this.applicationService.currenKbiSection!.Roof = {}
  }
  
  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentSection.Name;
  }

  getErrorMessage() {
    return `Select the type of roof on ${this.getInfraestructureName()}`
  }

  canContinue(): boolean {
    this.roofTypeHasErrors = !this.applicationService.currenKbiSection!.Roof.RoofType;
    return !this.roofTypeHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    return navigationService.navigateRelative(InsulationLayerComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection?.BuildingStructure.BuildingStructureType && this.applicationService.currenKbiSection!.BuildingStructure.BuildingStructureType.length > 0;
  }

}
