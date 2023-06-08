import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BuildingUse} from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiFireModule } from "../1-fire/kbi.fire.module";
import { KbiEnergyModule } from "../2-energy/kbi.energy.module";
import { KbiBuildingUseModule } from "../7-building-use/kbi.building-use.module";

@Component({
  selector: 'uses-ground-level-and-above-answers',
  templateUrl: './uses-ground-level-and-above-answers.component.html'
})
export class UsesGroundLevelAndAboveAnswersComponent {

  @Input() buildingUse: BuildingUse = {};

  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {

  }

  navigate(url: string) {
    console.log(`${KbiFireModule.baseRoute}/${url}`);
    this.navigationService.navigateRelative(`../${KbiBuildingUseModule.baseRoute}/${url}`, this.activatedRoute);
  }

  private buildingUseMapper: Record<string, string> = {
    "assembly_and_recreation": "Assembly and recreation",
    "assembly_recreation": "Assembly and recreation",
    "office": "Office",
    "residential_institution": "Residential institution",
    "other_residential_use": "Other residential use",
    "shop_commercial": "Shop and commercial",
    "other_non_residential": "Other non-residential",
    "none": "None"

  }
  getBuildingUse(name: string) {
    return this.buildingUseMapper[name];
  }

}
