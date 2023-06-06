import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { FeatureMaterialsOutsideComponent } from '../feature-materials-outside/feature-materials-outside.component';
import { PrimaryUseOfBuildingComponent } from '../../7-building-use/primary-use-of-building/primary-use-of-building.component';
import { KbiBuildingUseModule } from '../../7-building-use/kbi.building-use.module';

@Component({
  selector: 'hse-external-features',
  templateUrl: './external-features.component.html'
})
export class ExternalFeaturesComponent extends BaseComponent implements IHasNextPage, OnInit {
  static route: string = 'external-features';
  static title: string = "Features on outside walls - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  externalFeaturesHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (this.applicationService.currenKbiSection!.Walls.ExternalFeatures === void 0) {
      this.applicationService.currenKbiSection!.Walls.ExternalFeatures = [];
    }

    this.errorMessage = `Select the features on ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.currentSection.Name ?? this.applicationService.model.BuildingName;
  }

  canContinue(): boolean {
    this.externalFeaturesHasErrors = !this.applicationService.currenKbiSection!.Walls.ExternalFeatures || this.applicationService.currenKbiSection!.Walls.ExternalFeatures.length == 0;
    if (this.externalFeaturesHasErrors) {
      this.firstCheckboxAnchorId = `advertising-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    }

    return !this.externalFeaturesHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    const features = ['balconies', 'communal_walkway', 'escape_route_roof', 'external_staircases', 'machinery_outbuilding', 'machinery_roof_room', 'roof_lights', 'solar_shading'];
    if (this.applicationService.currenKbiSection?.Walls.ExternalFeatures?.some(x => features.includes(x))) {
      return navigationService.navigateRelative(FeatureMaterialsOutsideComponent.route, activatedRoute);
    }

    return navigationService.navigateRelative(`../${KbiBuildingUseModule.baseRoute}/${PrimaryUseOfBuildingComponent.route}`, activatedRoute);
    //return navigationService.navigateRelative(PrimaryUseOfBuildingComponent.route, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currenKbiSection?.Walls.ExternalWallInsulation?.CheckBoxSelection && (this.applicationService.currenKbiSection!.Walls.ExternalWallInsulation?.CheckBoxSelection![0] == 'none' || !!(this.applicationService.currenKbiSection!.Walls.ExternalWallInsulationPercentages));
  }

}
