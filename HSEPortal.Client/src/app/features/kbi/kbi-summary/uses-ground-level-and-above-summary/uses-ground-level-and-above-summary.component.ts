import { Component, Input } from '@angular/core';
import { KbiSummaryComponent } from '../kbi-summary.component';
import { BuildingUse, ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'uses-ground-level-and-above-summary',
  templateUrl: './uses-ground-level-and-above-summary.component.html'
})
export class UsesGroundLevelAndAboveSummaryComponent extends KbiSummaryComponent {

  @Input() buildingUse: BuildingUse = {};

  constructor(applicationService: ApplicationService) {
    super(applicationService)
  }

  private buildingUseMapper: Record<string, string> = {
    "assembly_and_recreation": "Assembly and recreation",
    "assembly_recreation": "Assembly and recreation",
    "office": "Office",
    "residential_dwellings": "Residential dwellings",
    "residential_institution": "Residential institution",
    "other_residential_use": "Other residential use",
    "shop_and_commercial": "Shop and commercial",
    "shop_commercial": "Shop and commercial",
    "other_non_residential": "Other non-residential",
    "none": "None"
  }
  getBuildingUse(name: string) {
    return this.buildingUseMapper[name];
  } 

}
