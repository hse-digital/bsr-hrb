import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent, GovukCheckboxComponent } from 'hse-angular';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, KeyValueHelper } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TitleService } from 'src/app/services/title.service';
import { PrimaryUseOfBuildingComponent } from '../../7-building-use/primary-use-of-building/primary-use-of-building.component';
import { KbiBuildingUseModule } from '../../7-building-use/kbi.building-use.module';
import { ExternalFeaturesComponent } from '../external-features/external-features.component';

@Component({
  selector: 'hse-feature-materials-outside',
  templateUrl: './feature-materials-outside.component.html'
})
export class FeatureMaterialsOutsideComponent extends BaseComponent implements IHasNextPage, OnInit, AfterViewInit {
  static route: string = 'external-feature-materials';
  static title: string = "Feature materials on outside wall - Register a high-rise building - GOV.UK";

  @ViewChildren("summaryError") override summaryError?: QueryList<GovukErrorSummaryComponent>;
  @ViewChildren(GovukCheckboxComponent) checkboxes?: QueryList<GovukCheckboxComponent>;

  errorMessage?: string;
  firstCheckboxAnchorId?: string;
  featureMaterialsOutsideHasErrors = false;

  keyValueHelper?: KeyValueHelper<string, string[]>;
  model: string[] = [];
  currentFeature?: string;

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    this.getNextPendingFeature();
    this.keyValueHelper = new KeyValueHelper<string, string[]>(this.applicationService.currentKbiSection?.Walls.ExternalFeatures);
    this.model = this.keyValueHelper.getKeys();
  }

  getNextPendingFeature() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentFeature = params['feature'] ?? this.keyValueHelper?.getKeys()[0];
      this.model = this.keyValueHelper?.getValueOf(this.currentFeature) ?? [];
    });
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

  canContinue(): boolean {
    this.featureMaterialsOutsideHasErrors = true;
    if (!this.model || this.model.length == 0) {
      this.errorMessage = `Select which materials are used most in the ${this.getFeatureName()} of ${this.getInfraestructureName()}`;
    } else if (this.model.length > 2) {
      this.errorMessage = "Select no more than 2 materials";
    } else {
      this.featureMaterialsOutsideHasErrors = false;
      this.applicationService.currentKbiSection!.Walls.ExternalFeatures = this.keyValueHelper?.KeyValue;
    }

    return !this.featureMaterialsOutsideHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    let selectedFeatures = this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.filter(x => ExternalFeaturesComponent.features.includes(x.key)) ?? [];
    let nextFeatureIndex = selectedFeatures.findIndex(x => x.key == this.currentFeature!) + 1;
    if (nextFeatureIndex >= selectedFeatures.length) {
      return navigationService.navigateRelative(`../${KbiBuildingUseModule.baseRoute}/${PrimaryUseOfBuildingComponent.route}`, activatedRoute);
    }

    return navigationService.navigateRelative(FeatureMaterialsOutsideComponent.route, activatedRoute, { feature: selectedFeatures.at(nextFeatureIndex) });
  }

  override canAccess(_: ActivatedRouteSnapshot) {
    let selectedFeatures = this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.filter(x => ExternalFeaturesComponent.features.includes(x.key)) ?? [];
    return selectedFeatures.length > 0;
  }

}
