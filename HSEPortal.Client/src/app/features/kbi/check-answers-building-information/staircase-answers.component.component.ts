import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Staircases } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";
import { KbiFireModule } from "../1-fire/kbi.fire.module";
import { KbiEnergyModule } from "../2-energy/kbi.energy.module";
import { KbiRoofModule } from "../4-roof/kbi.roof.module";
import { KbiStaircasesModule } from "../5-staircases/kbi.staircases.module";

@Component({
  selector: 'staircases-answers',
  templateUrl: './staircase-answers.component.html'
})
export class StaircasesAnswersComponent {

  @Input() staircases: Staircases = {};

  constructor(private navigationService: NavigationService, private activatedRoute: ActivatedRoute) {

  }

  navigate(url: string) {
    this.navigationService.navigateRelative(`../${KbiStaircasesModule.baseRoute}/${url}`, this.activatedRoute);
  }

}
