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
  static features = ['balconies', 'communal_walkway', 'escape_route_roof', 'external_staircases', 'machinery_outbuilding', 'machinery_roof_room', 'roof_lights', 'solar_shading'];

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  externalFeaturesHasErrors = false;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (this.applicationService.currentKbiSection!.Walls.ExternalFeatures === void 0) {
      this.applicationService.currentKbiSection!.Walls.ExternalFeatures = [];
    }

    this.errorMessage = `Select the features on ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.currentSection.Name ?? this.applicationService.model.BuildingName;
  }

  canContinue(): boolean {
    this.externalFeaturesHasErrors = !this.applicationService.currentKbiSection!.Walls.ExternalFeatures || this.applicationService.currentKbiSection!.Walls.ExternalFeatures.length == 0;
    if (this.externalFeaturesHasErrors) {
      this.firstCheckboxAnchorId = `advertising-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    }

    // Mapping between ExternalFeatures and FeatureMaterialsOutside. (check answers)
    if (!this.externalFeaturesHasErrors && this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.some(x => ExternalFeaturesComponent.features.includes(x))) { 
      if (!this.applicationService.currentKbiSection?.Walls.FeatureMaterialsOutside || Object.keys(this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside).length == 0) {
        this.initFeatureMaterialsOutside();
      } else {
        this.mapExternalFeatures();
      }
    }

    return !this.externalFeaturesHasErrors;
  }

  private initFeatureMaterialsOutside() {
    this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside = {};
    this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.forEach(feature => {
      this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside![feature] = [];
    });
  }

  private mapExternalFeatures() {
    let aux: Record<string, string[]> = {};
    this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.filter(x => ExternalFeaturesComponent.features.includes(x)).forEach(x =>
      aux[x] = (!!this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside![x] && this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside![x].length > 0)
        ? this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside![x]
        : []
    );
    this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside = aux;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.some(x => ExternalFeaturesComponent.features.includes(x))) {
      let feature = this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.find(x => ExternalFeaturesComponent.features.includes(x));
      return navigationService.navigateRelative(FeatureMaterialsOutsideComponent.route, activatedRoute, { feature: feature });
    }

    return navigationService.navigateRelative(`../${KbiBuildingUseModule.baseRoute}/${PrimaryUseOfBuildingComponent.route}`, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currentKbiSection?.Walls.ExternalWallInsulation?.CheckBoxSelection && (this.applicationService.currentKbiSection!.Walls.ExternalWallInsulation?.CheckBoxSelection![0] == 'none' || !!(this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages));
  }

}
