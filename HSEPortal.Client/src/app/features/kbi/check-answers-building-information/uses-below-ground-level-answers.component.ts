import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationService, BuildingUse} from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { TitleService } from "src/app/services/title.service";
import { BuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";
import { KbiBuildingUseModule } from "../7-building-use/kbi.building-use.module";
import { KbiNavigation } from "../kbi.navigation.ts.service";
import { KbiService } from "src/app/services/kbi.service";

@Component({
  selector: 'uses-below-ground-level-answers',
  templateUrl: './uses-below-ground-level-answers.component.html'
})
export class UsesBelowGroundLevelAnswersComponent  extends BuildingInformationCheckAnswersComponent {

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
    "shop_commercial": "Shop and commercial",
    "other_non-residential": "Other non-residential",
    "other_non_residential": "Other non-residential",
    "none": "None"

  }
  getBuildingUse(name: string) {
    return this.buildingUseMapper[name];
  }

}
