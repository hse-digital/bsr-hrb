import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Roof } from "src/app/services/application.service";
import { KbiService } from "src/app/services/kbi.service";
import { KbiRoofModule } from "src/app/features/kbi/4-roof/kbi.roof.module";
import { ChangeBuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";

@Component({
  selector: 'roof-answers',
  templateUrl: './roof-answers.component.html'
})
export class ChangeRoofAnswersComponent extends ChangeBuildingInformationCheckAnswersComponent {

  @Input() roof: Roof = {};

  constructor(activatedRoute: ActivatedRoute, kbiService: KbiService) {
    super(activatedRoute, kbiService);
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
