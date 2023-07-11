import { Component, Input } from '@angular/core';
import { KbiSummaryComponent } from '../kbi-summary.component';
import { BuildingUse, ApplicationService } from 'src/app/services/application.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'uses-below-ground-level-summary',
  templateUrl: './uses-below-ground-level-summary.component.html'
})
export class UsesBelowGroundLevelSummaryComponent extends KbiSummaryComponent {

  @Input() buildingUse: BuildingUse = {};

  constructor(applicationService: ApplicationService, navigationService: NavigationService) {
    super(applicationService, navigationService);
  }

  private buildingUseMapper: Record<string, string> = {
    "assembly_and_recreation": "Assembly and recreation",
    "assembly_recreation": "Assembly and recreation",
    "office": "Office",
    "residential_institution": "Residential institution",
    "other_residential_use": "Other residential use",
    "shop_commercial": "Shop and commercial",
    "other_non-residential": "Other non-residential",
    "other_non_residential": "Other non-residential",
    "none": "None"

  }
  getBuildingUse(name: string) {
    return this.buildingUseMapper[name];
  }
}
