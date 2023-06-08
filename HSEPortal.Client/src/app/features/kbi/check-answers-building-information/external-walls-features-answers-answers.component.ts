import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Walls} from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiFireModule } from "../1-fire/kbi.fire.module";
import { KbiStructureModule } from "../3-structure/kbi.structure.module";
import { KbiWallsModule } from "../6-walls/kbi.walls.module";

@Component({
  selector: 'external-walls-features-answers',
  templateUrl: './external-walls-features-answers.component.html'
})
export class ExternalWallsAnswersComponent {

  @Input() externalWalls: Walls = {};

  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {

  }

  navigate(url: string) {
    this.navigationService.navigateRelative(`../${KbiWallsModule.baseRoute}/${url}`, this.activatedRoute);
  }

  private externalWallMaterialsMapper: Record<string, string> = {
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
  getExternalWallMaterialName(name: string) {
    return this.externalWallMaterialsMapper[name];
  }

  private acmFireTestsMapper: Record<string, string> = {
    "fire-classification": "Meets the fire classification A2-s1, d0 or better",
    "large-scale-fire-test": "Has passed a large-scale fire test to BS8414",
    "neither-these": "Neither A2-s1, d0, BS8414"

  }
  getACMFireTests(name: string) {
    return this.acmFireTestsMapper[name];
  }

  private hplFireTestsMapper: Record<string, string> = {
    "fire-classification": "Meets the fire classification A2-s1, d0 or better",
    "large-scale-fire-test": "Has passed a large-scale fire test to BS8414",
    "neither-these": "Neither A2-s1, d0, BS8414"

  }
  getHPLFireTests(name: string) {
    return this.hplFireTestsMapper[name];
  }

  private insulationTypeMapper: Record<string, string> = {
    "fibre_glass_mineral_wool": "Fibre insulation - glass or mineral wool",
    "fibre_wood_sheep_wool": "Fibre insulation - wood or sheep wool",
    "foil_bubble_multifoil_insulation": "Foil bubble or multifoil insulation",
    "phenolic_foam": "Phenolic foam",
    "eps_xps": "Polystyrene insulation - expanded polystyrene (EPS) or extruded polystyrene (XPS)",
    "pur_pir_iso": "Polyurethane (PUR) or polyisocyanurate (PIR or ISO)",
    "other": "Other",
  }
  getInsulationName(equipment: string) {
    return this.insulationTypeMapper[equipment];
  }


}