import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/helpers/base.component";
import { ApplicationService } from "../../../../../services/application.service";
import { CaptionService } from "../../../../../services/caption.service";

@Component({
  templateUrl: './people-living-in-building.component.html'
})
export class PeopleLivingInBuildingComponent extends BaseComponent {
  static route: string = 'people-living-in-building';
  private blockId!: string;

  constructor(router: Router, activatedRoute: ActivatedRoute, private captionService: CaptionService, private applicationService: ApplicationService) {
    super(router, activatedRoute);
    this.blockId = this.getURLParam('blockId');
  }

  nextScreenRoute: string = '';
  building: { peopleLivingInBuilding?: string } = {}
  peopleLivingHasErrors = false;

  canContinue(): boolean {
    let peopleLivingInBuilding = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId)?.PeopleLivingInBuilding;
    this.peopleLivingHasErrors = !peopleLivingInBuilding;
    return !this.peopleLivingHasErrors;
  }

  override navigateNextScreenRoute() {
    this.router.navigate(['../another-block'], { relativeTo: this.activatedRoute })
  }

  updatePeopleLivingInBuilding(peopleLivingInBuilding: string) {
    let block = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId);
    if (block) block.PeopleLivingInBuilding = peopleLivingInBuilding;
  }

  get captionText(): string | undefined {
    return this.captionService.caption;
  }

}
