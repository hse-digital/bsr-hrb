import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationService, Staircases } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiStaircasesModule } from "../5-staircases/kbi.staircases.module";
import { TitleService } from "src/app/services/title.service";
import { BuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";
import { KbiNavigation } from "../kbi.navigation.ts.service";
import { KbiService } from "src/app/services/kbi.service";

@Component({
  selector: 'staircases-answers',
  templateUrl: './staircase-answers.component.html'
})
export class StaircasesAnswersComponent  extends BuildingInformationCheckAnswersComponent {

  @Input() staircases: Staircases = {};

  constructor(router: Router, applicationService: ApplicationService, navigationService: NavigationService, activatedRoute: ActivatedRoute, titleService: TitleService, kbiNavigation: KbiNavigation, kbiService: KbiService) {
    super(router, applicationService, navigationService, activatedRoute, titleService, kbiNavigation, kbiService);
  }

  navigate(url: string) {
    this.navigateTo(url, KbiStaircasesModule.baseRoute);
  }

}
