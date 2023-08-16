import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GovukCheckboxNoneComponent } from 'src/app/components/govuk-checkbox-none/govuk-checkbox-none.component';
import { ApplicationService } from 'src/app/services/application.service';
import { FeatureMaterialsOutsideComponent } from '../feature-materials-outside/feature-materials-outside.component';
import { PrimaryUseOfBuildingComponent } from '../../7-building-use/primary-use-of-building/primary-use-of-building.component';
import { KbiBuildingUseModule } from '../../7-building-use/kbi.building-use.module';
import { PageComponent } from 'src/app/helpers/page.component';
import { CloneHelper } from 'src/app/helpers/array-helper';

@Component({
  selector: 'hse-external-features',
  templateUrl: './external-features.component.html'
})
export class ExternalFeaturesComponent extends PageComponent<string[]> {
  static route: string = 'external-features';
  static title: string = "Features on outside walls - Register a high-rise building - GOV.UK";
  static features = ['balconies', 'communal_walkway', 'escape_route_roof', 'external_staircases', 'machinery_outbuilding', 'machinery_roof_room', 'roof_lights', 'solar_shading'];

  @ViewChild(GovukCheckboxNoneComponent) equipmentCheckboxGroup?: GovukCheckboxNoneComponent;

  firstCheckboxAnchorId?: string;
  errorMessage?: string;
  externalFeaturesHasErrors = false;

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  getInfraestructureName() {
    return this.applicationService.currentKbiSection!.StructureName ?? this.applicationService.model.BuildingName;
  }

  override onInit(applicationService: ApplicationService): void {
    if (!this.applicationService.currentKbiSection!.Walls.ExternalFeatures || this.applicationService.currentKbiSection!.Walls.ExternalFeatures.length == 0) {
      this.applicationService.currentKbiSection!.Walls.ExternalFeatures = [];
    }
    this.model = CloneHelper.DeepCopy(this.applicationService.currentKbiSection!.Walls.ExternalFeatures);
    this.errorMessage = `Select the features on ${this.getInfraestructureName()}`;
  }

  override async onSave(applicationService: ApplicationService): Promise<void> {
    this.applicationService.currentKbiSection!.Walls.ExternalFeatures = CloneHelper.DeepCopy(this.model);

    // Mapping between ExternalFeatures and FeatureMaterialsOutside. (check answers)
    if (this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.some(x => ExternalFeaturesComponent.features.includes(x))) { 
      if (!this.applicationService.currentKbiSection?.Walls.FeatureMaterialsOutside || Object.keys(this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside).length == 0) {
        this.initFeatureMaterialsOutside();
      } else {
        this.mapExternalFeatures();
      }
    }
  }

  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return !!this.applicationService.currentKbiSection?.Walls.ExternalWallInsulation?.CheckBoxSelection 
      && (this.applicationService.currentKbiSection!.Walls.ExternalWallInsulation?.CheckBoxSelection![0] == 'none' || !!(this.applicationService.currentKbiSection!.Walls.ExternalWallInsulationPercentages));
  }

  override isValid(): boolean {
    this.externalFeaturesHasErrors = !this.model || this.model.length == 0;
    if (this.externalFeaturesHasErrors) {
      this.firstCheckboxAnchorId = `advertising-${this.equipmentCheckboxGroup?.checkboxElements?.first.innerId}`;
    }
    return !this.externalFeaturesHasErrors;
  }

  override navigateNext(): Promise<boolean | void> {
    if (this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.some(x => ExternalFeaturesComponent.features.includes(x))) {
      let feature = this.applicationService.currentKbiSection?.Walls.ExternalFeatures?.find(x => ExternalFeaturesComponent.features.includes(x));
      return this.navigationService.navigateRelative(FeatureMaterialsOutsideComponent.route, this.activatedRoute, { feature: feature });
    }

    return this.navigationService.navigateRelative(`../${KbiBuildingUseModule.baseRoute}/${PrimaryUseOfBuildingComponent.route}`, this.activatedRoute);
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

}
