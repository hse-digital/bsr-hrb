import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationService } from "src/app/services/application.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  templateUrl: './blocks-intro.component.html'
})
export class BuildingBlocksIntroComponent {

  constructor(public router: Router, applicationService: ApplicationService, navigationService: NavigationService) {
    applicationService.currentBlock = {};
  }

}
