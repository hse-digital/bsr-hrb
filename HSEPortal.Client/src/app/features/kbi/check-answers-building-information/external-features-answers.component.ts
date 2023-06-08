import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Walls} from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiFireModule } from "../1-fire/kbi.fire.module";
import { KbiStructureModule } from "../3-structure/kbi.structure.module";
import { KbiWallsModule } from "../6-walls/kbi.walls.module";

@Component({
  selector: 'external-features-answers',
  templateUrl: './external-features-answers.component.html'
})
export class ExternalFeaturesAnswersComponent {

  @Input() externalFeatures: Walls = {};

  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {

  }

  navigate(url: string) {
    this.navigationService.navigateRelative(`../${KbiWallsModule.baseRoute}/${url}`, this.activatedRoute);
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
