import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationService, Roof } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiRoofModule } from "../4-roof/kbi.roof.module";
import { TitleService } from "src/app/services/title.service";
import { BuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";
import { KbiNavigation } from "../kbi.navigation.ts.service";

@Component({
  selector: 'roof-answers',
  templateUrl: './roof-answers.component.html'
})
export class RoofAnswersComponent  extends BuildingInformationCheckAnswersComponent {

  @Input() roof: Roof = {};

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, kbiNavigation: KbiNavigation) {
    super(router, applicationService, navigationService, activatedRoute, titleService, kbiNavigation);
  }

  navigate(url: string) {
    this.navigateTo(url, KbiRoofModule.baseRoute);
  }

  private roofTypeMapper: Record<string, string> = {
    "flat-roof": "Flat roof",
    "pitched-roof": "Pitched roof",
    "mix-flat-pitched": "Mix of flat and pitched"

  }
  getRoofType(name: string) {
    return this.roofTypeMapper[name];
  }

  private roofMaterialMapper: Record<string, string> = {
    "composite-panels": "Composite panels",
    "fibre-cement": "Fibre cement asbestos",
    "metal-sheet": "Metal sheet",
    "plastic-sheet": "Plastic sheet",
    "polycarbonate-sheet": "Polycarbonate sheet",
    "other-sheet-material": "Other sheet material",
    "rolled-liquid-bitumen-felt": "Rolled or liquid - bitumen felt",
    "rolled-liquid-other-felt": "Rolled or liquid - other felt",
    "rolled-liquid-rubber": "Rolled or liquid rubber",
    "rolled-liquid-hot-cold-roof": "Rolled or liquid hot or cold roof systems",
    "raac": "Reinforced autoclaved aerated concrete (RAAC)",
    "shingles": "Shingles",
    "slate": "Slate",
    "tiles": "Tiles",
    "green-roof": "Green roof",
    "none": "None"
  }
  getRoofMaterial(name: string) {
    return this.roofMaterialMapper[name];
  }

  private roofInsulationTypeMapper: Record<string, string> = {
    "yes-top": "Yes, on top of the roof structure",
    "yes-below": "Yes, below the roof structure",
    "no": "No"
  }
  getRoofInsulation(name: string) {
    return this.roofInsulationTypeMapper[name];
  }


}
