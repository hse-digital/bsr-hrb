import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GovukErrorSummaryComponent } from 'hse-angular';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { BaseComponent } from 'src/app/helpers/base.component';
import { IHasNextPage } from 'src/app/helpers/has-next-page.interface';
import { ApplicationService, KeyValueHelper } from 'src/app/services/application.service';
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

  keyValueHelper?: KeyValueHelper<string, string[]>;
  model: string[] = [];

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService) {
    super(router, applicationService, navigationService, activatedRoute, titleService);
  }

  ngOnInit(): void {
    if (this.applicationService.currentKbiSection!.Walls.ExternalFeatures === void 0) {
      this.applicationService.currentKbiSection!.Walls.ExternalFeatures = [];
      this.keyValueHelper = new KeyValueHelper<string, string[]>(this.applicationService.currentKbiSection!.Walls.ExternalFeatures);
      this.model = this.keyValueHelper.getKeys() ?? []; 
    }

    this.errorMessage = `Select the features on ${this.getInfraestructureName()}`;
  }

  getInfraestructureName() {
    return this.applicationService.currentKbiSection!.StructureName ?? this.applicationService.model.BuildingName;
  }

  canContinue(): boolean {
    this.externalFeaturesHasErrors = !this.model || this.model.length == 0;
    if (this.externalFeaturesHasErrors) {
      this.firstCheckboxAnchorId = `advertising-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    } else {
      this.keyValueHelper?.setKeys(this.model!);
      this.applicationService.currentKbiSection!.Walls.ExternalFeatures = this.keyValueHelper?.KeyValue;
    }

    return !this.externalFeaturesHasErrors;
  }

  navigateToNextPage(navigationService: NavigationService, activatedRoute: ActivatedRoute): Promise<boolean> {
    if (this.keyValueHelper?.getKeys()?.some(x => ExternalFeaturesComponent.features.includes(x))) {
      let feature = this.keyValueHelper.getKeys()?.find(x => ExternalFeaturesComponent.features.includes(x));
      return navigationService.navigateRelative(FeatureMaterialsOutsideComponent.route, activatedRoute, { feature: feature });
    }

    return navigationService.navigateRelative(`../${KbiBuildingUseModule.baseRoute}/${PrimaryUseOfBuildingComponent.route}`, activatedRoute);
  }

  override canAccess(routeSnapshot: ActivatedRouteSnapshot) {
    return !!this.applicationService.currentKbiSection?.Walls.ExternalWallInsulation && (this.applicationService.currentKbiSection!.Walls.ExternalWallInsulation?.map(x => x.key)![0] == 'none');
  }

}
