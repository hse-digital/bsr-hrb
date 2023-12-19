import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BuildingUse} from "src/app/services/application.service";
import { KbiService } from "src/app/services/kbi.service";
import { KbiBuildingUseModule } from "src/app/features/kbi/7-building-use/kbi.building-use.module";
import { ChangeBuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";

@Component({
  selector: 'uses-ground-level-and-above-answers',
  templateUrl: './uses-ground-level-and-above-answers.component.html'
})
export class ChangeUsesGroundLevelAndAboveAnswersComponent  extends ChangeBuildingInformationCheckAnswersComponent {

  @Input() buildingUse: BuildingUse = {};

  constructor(activatedRoute: ActivatedRoute, kbiService: KbiService) {
    super(activatedRoute, kbiService);
  }

  navigate(url: string) {
    this.navigateTo(url, KbiBuildingUseModule.baseRoute);
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
    "other_non-residential": "Other non-residential",
    "other_non_residential": "Other non-residential",
    "none": "None"
  }
  getBuildingUse(name: string) {
    return this.buildingUseMapper[name];
  } 

}
