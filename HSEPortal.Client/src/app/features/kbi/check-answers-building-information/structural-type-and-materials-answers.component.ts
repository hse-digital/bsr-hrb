import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationService, BuildingStructure} from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiFireModule } from "../1-fire/kbi.fire.module";
import { KbiStructureModule } from "../3-structure/kbi.structure.module";
import { TitleService } from "src/app/services/title.service";
import { BuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";
import { KbiNavigation } from "../kbi.navigation.ts.service";
import { KbiService } from "src/app/services/kbi.service";

@Component({
  selector: 'structural-type-and-materials-answers',
  templateUrl: './structural-type-and-materials-answers.component.html'
})
export class StructuralTypeAndMaterialsAnswersComponent  extends BuildingInformationCheckAnswersComponent {

  @Input() buildingStructure: BuildingStructure = {};


  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, kbiNavigation: KbiNavigation, kbiService: KbiService) {
    super(router, applicationService, navigationService, activatedRoute, titleService, kbiNavigation, kbiService);
  }

  navigate(url: string) {
    this.navigateTo(url, KbiStructureModule.baseRoute);
  }

  private materialNameMapper: Record<string, string> = {
    "composite_steel_concrete": "Composite steel and concrete",
    "concrete_large_panels_1960": "Concrete large panel system - 1960s",
    "concrete_large_panels_1970": "Concrete large panel system - 1970 onwards",
    "modular_concrete": "Modular - concrete",
    "concrete_other": "Concrete - other",
    "lightweight_metal": "Lightweight metal structure, like aluminium",
    "Masonry": "Masonry",
    "modular_steel": "Modular - steel",
    "steel_frame": "Steel frame",
    "modular_other_metal": "Modular - other metal",
    "modular_timber": "Modular - timber",
    "timber": "Timber",
    "none": "None"

  }
  getMaterialName(name: string) {
    return this.materialNameMapper[name];
  }

  getModularMaterials() {
    const modularMaterials = this.buildingStructure?.BuildingStructureType?.filter(material => material.toLowerCase().includes("modular")).map(material => this.getMaterialName(material));

    if (modularMaterials!.length > 0) {
      return modularMaterials;
    }
    else {

      return ["None"];
    }

  }

  getNonModularMaterials() {
    const nonModularMaterials = this.buildingStructure?.BuildingStructureType?.filter(material => !material.toLowerCase().includes("modular")).map(material => this.getMaterialName(material));

    if (nonModularMaterials!.length > 0) {
      return nonModularMaterials;
    }
    else {
      return ["None"];
    }

  }

}
