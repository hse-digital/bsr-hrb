import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BaseFormComponent } from "src/app/helpers/base-form.component";
import { CaptionService } from "../caption.service";

@Component({
  templateUrl: './people-living-in-building.component.html'
})
export class PeopleLivingInBuildingComponent extends BaseFormComponent {

  constructor(router: Router, private captionService: CaptionService) {
    super(router);
  }

  nextScreenRoute: string = '/building-registration/building/people-living-in-building';
  building: { peopleLivingInBuilding?: any } = {};
  peopleLivingHasErrors = false;

  canContinue(): boolean {
    this.peopleLivingHasErrors = !this.building.peopleLivingInBuilding;
    return !this.peopleLivingHasErrors;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

}
