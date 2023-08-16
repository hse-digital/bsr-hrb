import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxComponent } from 'hse-angular';
import { ApplicationService } from 'src/app/services/application.service';
import { PrimaryUseOfBuildingComponent } from '../../7-building-use/primary-use-of-building/primary-use-of-building.component';
import { KbiBuildingUseModule } from '../../7-building-use/kbi.building-use.module';
import { ExternalFeaturesComponent } from '../external-features/external-features.component';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-feature-materials-outside',
  templateUrl: './feature-materials-outside.component.html'
})
export class FeatureMaterialsOutsideComponent extends PageComponent<Record<string, string[]>> implements AfterViewInit {
  static route: string = 'external-feature-materials';
  static title: string = "Feature materials on outside wall - Register a high-rise building - GOV.UK";

  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  featureMaterialsOutsideHasErrors = false;

  currentFeature?: string;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.getNextPendingFeature();

    if (!this.applicationService.currentKbiSection?.Walls.FeatureMaterialsOutside || Object.keys(this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside).length == 0) {
      this.initFeatureMaterialsOutside();
    } else {
      this.mapExternalFeatures();
    }

    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside);
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside = CloneHelper.DeepCopy(this.model);
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    let selectedFeatures = this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.filter(x => ExternalFeaturesComponent.features.includes(x)) ?? [];
    return selectedFeatures.length > 0;
  }

  override isValid(): boolean {
    this.featureMaterialsOutsideHasErrors = true;
    if (!this.model || this.model[this.currentFeature!].length == 0) {
      this.errorMessage = `Select which materials are used most in the ${this.getFeatureName()} of ${this.getInfraestructureName()}`;
    } else if (this.model[this.currentFeature!].length > 2) {
      this.errorMessage = "Select no more than 2 materials";
    } else {
      this.featureMaterialsOutsideHasErrors = false;
    }

    return !this.featureMaterialsOutsideHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    let selectedFeatures = this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.filter(x => ExternalFeaturesComponent.features.includes(x)) ?? [];
    let nextFeatureIndex = selectedFeatures.indexOf(this.currentFeature!) + 1;
    if (nextFeatureIndex >= selectedFeatures.length) {
      return this.navigationService.navigateRelative(`../${KbiBuildingUseModule.baseRoute}/${PrimaryUseOfBuildingComponent.route}`, this.activatedRoute);
    }

    return this.navigationService.navigateRelative(FeatureMaterialsOutsideComponent.route, this.activatedRoute, { feature: selectedFeatures.at(nextFeatureIndex) });
  }

  getNextPendingFeature() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentFeature = params['feature'];
      this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside);
    });
  }

  initFeatureMaterialsOutside() {
    this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside = {};
    this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.forEach(feature => {
      this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside![feature] = [];
    });
  }

  mapExternalFeatures() {
    let aux: Record<string, string[]> = {};
    this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.filter(x => ExternalFeaturesComponent.features.includes(x)).forEach(x =>
      aux[x] = (!!this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside![x] && this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside![x].length > 0)
        ? this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside![x]
        : []
    );
    this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside = aux;
  }

  ngAfterViewInit(): void {
    this.firstCheckboxAnchorId = `aluminium-${this.checkboxes?.first.innerId}`;
  }

  getInfraestructureName() {
    return this.applicationService.model.NumberOfSections === 'one'
      ? this.applicationService.model.BuildingName
      : this.applicationService.currentKbiSection!.StructureName;
  }

  featuresNames: Record<string, string> = {
    "balconies": "balconies",
    "communal_walkway": "communal walkways",
    "escape_route_roof": "escape route across the roof",
    "solar_shading": "solar shading",
    "external_staircases": "staircases",
    "roof_lights": "roof lights",
    "machinery_outbuilding": "machinery in an outbuilding",
    "machinery_roof_room": "machinery in a room on the roof"
  }

  getFeatureName() {
    return this.featuresNames[this.currentFeature ?? ""];
  }
}
