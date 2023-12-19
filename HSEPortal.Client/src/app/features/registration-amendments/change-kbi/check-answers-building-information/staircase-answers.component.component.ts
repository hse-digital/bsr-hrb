import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Staircases } from "src/app/services/application.service";
import { KbiService } from "src/app/services/kbi.service";
import { KbiStaircasesModule } from "src/app/features/kbi/5-staircases/kbi.staircases.module";
import { ChangeBuildingInformationCheckAnswersComponent } from "./check-answers-building-information.component";

@Component({
  selector: 'staircases-answers',
  templateUrl: './staircase-answers.component.html'
})
export class ChangeStaircasesAnswersComponent  extends ChangeBuildingInformationCheckAnswersComponent {

  @Input() staircases: Staircases = {};

  constructor(activatedRoute: ActivatedRoute, kbiService: KbiService) {
    super(activatedRoute, kbiService);
  }

  navigate(url: string) {
    this.navigateTo(url, KbiStaircasesModule.baseRoute);
  }

}
