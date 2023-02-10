import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { BlockRegistrationService } from "src/app/services/block-registration.service";
import { CaptionService } from "../../../../../services/caption.service";

@Component({
  templateUrl: './people-living-in-building.component.html'
})
export class PeopleLivingInBuildingComponent extends BaseComponent {

  constructor(router: Router, private captionService: CaptionService, private blockRegistrationService: BlockRegistrationService) {
    super(router);
  }

  nextScreenRoute: string = '/building-registration/building/another-block';
  building: { peopleLivingInBuilding?: any } = {};
  peopleLivingHasErrors = false;

  canContinue(): boolean {
    this.peopleLivingHasErrors = !this.building.peopleLivingInBuilding;
    return !this.peopleLivingHasErrors;
  }

  updatePeopleLivingInBuilding(peopleLivingInBuilding: string) {
    this.blockRegistrationService.setPeopleLivingInBuilding(peopleLivingInBuilding);
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

}
