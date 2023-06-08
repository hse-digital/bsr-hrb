import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationService, Walls} from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiFireModule } from "../1-fire/kbi.fire.module";
import { KbiStructureModule } from "../3-structure/kbi.structure.module";
import { KbiWallsModule } from "../6-walls/kbi.walls.module";
import { ExternalFeaturesComponent } from "../6-walls/external-features/external-features.component";
import { BuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";
import { TitleService } from "src/app/services/title.service";
import { ExternalWallMaterialsComponent } from "../6-walls/external-wall-materials/external-wall-materials.component";
import { KbiNavigation } from "../kbi.navigation.ts.service";

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

  nagivateToExternalFeaturesMaterials(){
    this.navigateTo(ExternalWallMaterialsComponent.route, KbiWallsModule.baseRoute);
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

  getBalconiesMaterial() {
    if (!this.externalFeatures.FeatureMaterialsOutside!["balconies"]) {
      return ["Not applicable"];

    }
    else {
      return this.externalFeatures.FeatureMaterialsOutside!["balconies"]!;
    }
  }

  private materialsMapper: Record<string, string> = {
    "acm": "Aluminium composite materials (ACM)",
    "hpl": "High pressure laminate (HPL)",
    "metal-composite-panels": "Metal composite panels",
    "other-composite-panels": "Other composite panels",
    "concrete": "Concrete",
    "green-walls": "Green walls",
    "masonry": "Masonry",
    "metal-panels": "Metal panels",
    "render": "Render",
    "tiles": "Tiles",
    "timber": "Timber",
    "glass": "Glass",
    "other": "Other"
  }
  getMaterialName(name: string) {
    return this.materialsMapper[name];
  }
}
