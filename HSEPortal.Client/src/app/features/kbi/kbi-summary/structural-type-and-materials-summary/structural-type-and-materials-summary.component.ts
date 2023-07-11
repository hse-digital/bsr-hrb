import { Component, Input } from '@angular/core';
import { KbiSummaryComponent } from '../kbi-summary.component';
import { BuildingStructure, ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'structural-type-and-materials-summary',
  templateUrl: './structural-type-and-materials-summary.component.html'
})
export class StructuralTypeAndMaterialsSummaryComponent  extends KbiSummaryComponent {

  @Input() buildingStructure: BuildingStructure = {};

  constructor(applicationService: ApplicationService, navigationService: NavigationService) {
    super(applicationService, navigationService);
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
    } else {

      return ["None"];
    }
  }

  getNonModularMaterials() {
    const nonModularMaterials = this.buildingStructure?.BuildingStructureType?.filter(material => !material.toLowerCase().includes("modular")).map(material => this.getMaterialName(material));

    if (nonModularMaterials!.length > 0) {
      return nonModularMaterials;
    } else {
      return ["None"];
    }

  }

}
