import { Component, Input } from '@angular/core';
import { KbiSummaryComponent } from '../kbi-summary.component';
import { Roof, ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'roof-summary',
  templateUrl: './roof-summary.component.html'
})
export class RoofSummaryComponent extends KbiSummaryComponent {

  @Input() roof: Roof = {};

  constructor(applicationService: ApplicationService, navigationService: NavigationService) {
    super(applicationService, navigationService);
  }

  private roofTypeMapper: Record<string, string> = {
    "flat-roof": "Flat roof",
    "pitched-roof": "Pitched roof",
    "mix-flat-pitched": "Mix of flat and pitched",
    "none": "None"
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
