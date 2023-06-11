import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationService, Walls } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiFireModule } from "../1-fire/kbi.fire.module";
import { KbiStructureModule } from "../3-structure/kbi.structure.module";
import { KbiWallsModule } from "../6-walls/kbi.walls.module";
import { ExternalFeaturesComponent } from "../6-walls/external-features/external-features.component";
import { BuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";
import { TitleService } from "src/app/services/title.service";
import { ExternalWallMaterialsComponent } from "../6-walls/external-wall-materials/external-wall-materials.component";
import { KbiNavigation } from "../kbi.navigation.ts.service";
import { FeatureMaterialsOutsideComponent } from "../6-walls/feature-materials-outside/feature-materials-outside.component";

@Component({
  selector: 'external-features-answers',
  templateUrl: './external-features-answers.component.html'
})
export class ExternalFeaturesAnswersComponent extends BuildingInformationCheckAnswersComponent {

  @Input() externalFeatures: Walls = {};

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, kbiNavigation: KbiNavigation) {
    super(router, applicationService, navigationService, activatedRoute, titleService, kbiNavigation);
  }

  navigateToExternalFeatures() {
    this.navigateTo(ExternalFeaturesComponent.route, KbiWallsModule.baseRoute);
  }

  nagivateToExternalFeaturesMaterials(feature: string) {
    this.navigateTo(FeatureMaterialsOutsideComponent.route, KbiWallsModule.baseRoute, { feature: feature });
  }

  getAvailableFeatures() {
    return this.externalFeatures.ExternalFeatures!.filter(x => ExternalFeaturesComponent.features.includes(x));
  }

  private externalFeaturesMapper: Record<string, string> = {
    "advertising": "Advertising hoarding attached to a wall",
    "balconies": "Balconies",
    "communal_recreation_area": "Communal recreation area on the roof",
    "communal_walkway": "Communal walkway between structures",
    "escape_route_roof": "Escape route onto and across the roof",
    "external_staircases": "External staircases",
    "machinery_outbuilding": "Machinery in an outbuilding",
    "machinery_roof_room": "Machinery in a room on the roof",
    "machinery_roof": "Machinery on the roof",
    "phone_masts": "Phone masts",
    "roof_lights": "Roof lights",
    "solar_shading": "Solar shading",
    "other": "Other",
    "none": "None"
  }

  getExternalFeature(name: string) {
    return this.externalFeaturesMapper[name] ?? "";
  }

  private featureNameMapper: Record<string, string> = {
    "balconies": "Balconies",
    "communal_walkway": "Communal walkways",
    "escape_route_roof": "Escape route across the roof",
    "solar_shading": "Solar shading",
    "external_staircases": "Staircases",
    "roof_lights": "Roof lights",
    "machinery_outbuilding": "Machinery in an outbuilding",
    "machinery_roof_room": "Machinery in a room on the roof"
  }
  getFeatureName(name: string) {
    return this.featureNameMapper[name];
  }

  // getBalconiesMaterial() {
  //   if (!this.externalFeatures.FeatureMaterialsOutside!["balconies"]) {
  //     return ["Not applicable"];

  //   }
  //   else {
  //     return this.externalFeatures.FeatureMaterialsOutside!["balconies"]!;
  //   }
  // }

  hasFeature(name: string) {
    if(!this.applicationService.currentKbiSection?.Walls.FeatureMaterialsOutside) return false;
    return Object.keys(this.applicationService.currentKbiSection!.Walls.FeatureMaterialsOutside!).includes(name);
  }

  getMaterials(feature: string){
    return this.hasFeature(feature) ? this.externalFeatures?.FeatureMaterialsOutside![feature] : [];
  }

  private materialsMapper: Record<string, string> = {
    "aluminium":   "Aluminium", 
    "concrete": "Concrete", 
    "glass": "Glass", 
    "masonry": "Masonry", 
    "metal": "Metal", 
    "plastic": "Plastic", 
    "slate": "Slate", 
    "timber": "Timber", 
    "other": "Other"
  }
  getMaterialName(name: string) {
    return this.materialsMapper[name];
  }
}
