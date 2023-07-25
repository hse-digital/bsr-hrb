import { Component, Input } from '@angular/core';
import { KbiSummaryComponent } from '../kbi-summary.component';
import { Walls, ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'external-walls-features-summary',
  templateUrl: './external-walls-features-summary.component.html'
})
export class ExternalWallsFeaturesSummaryComponent extends KbiSummaryComponent {

  @Input() externalWalls: Walls = {};

  constructor(applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(applicationService, navigationService, activatedRoute);
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
    "other": "Other",
    "none": "None"
  }
  getExternalWallMaterialName(name: string) {
    return this.externalWallMaterialsMapper[name];
  }

  private acmFireTestsMapper: Record<string, string> = {
    "fire-classification": "Meets the fire classification A2-s1, d0 or better",
    "large-scale-fire-test": "Has passed a large-scale fire test to BS8414",
    "neither-these": "Does not meet A2-s1, d0 and has not passed BS8414"

  }
  getACMFireTests(name: string) {
    return this.acmFireTestsMapper[name];
  }

  private hplFireTestsMapper: Record<string, string> = {
    "fire-classification": "Meets the fire classification A2-s1, d0 or better",
    "large-scale-fire-test": "Has passed a large-scale fire test to BS8414",
    "none": "Does not meet A2-s1, d0 and has not passed BS8414"

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
    "none": "None"
  }
  getInsulationName(equipment: string) {
    return this.insulationTypeMapper[equipment];
  }

  hasHpl(){
    return this.externalWalls!.ExternalWallMaterials!.indexOf('hpl') > -1;
  }

  hasAcm(){
    return this.externalWalls!.ExternalWallMaterials!.indexOf('acm') > -1;
  }

  isNone() {
    return this.externalWalls!.ExternalWallInsulation!.CheckBoxSelection!.includes("none");
  }
}
