import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationService, BuildingUse} from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiBuildingUseModule } from "../7-building-use/kbi.building-use.module";
import { TitleService } from "src/app/services/title.service";
import { BuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";
import { KbiNavigation } from "../kbi.navigation.ts.service";
import { KbiService } from "src/app/services/kbi.service";

@Component({
  selector: 'uses-ground-level-and-above-answers',
  templateUrl: './uses-ground-level-and-above-answers.component.html'
})
export class UsesGroundLevelAndAboveAnswersComponent  extends BuildingInformationCheckAnswersComponent {

  @Input() buildingUse: BuildingUse = {};


  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, kbiNavigation: KbiNavigation, kbiService: KbiService) {
    super(router, applicationService, navigationService, activatedRoute, titleService, kbiNavigation, kbiService);
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
    "other_non_residential": "Other non-residential",
    "none": "None"
  }
  getBuildingUse(name: string) {
    return this.buildingUseMapper[name];
  } 

}
