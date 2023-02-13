import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/helpers/base.component';
import { ApplicationService } from 'src/app/services/application.service';
import { CaptionService } from 'src/app/services/caption.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'hse-number-blocks-building',
  templateUrl: './number-blocks-building.component.html',
})
export class NumberBlocksBuildingComponent extends BaseComponent {
  static route: string = ''
  private blockId!: string;

  constructor(router: Router, applicationService: ApplicationService, private captionService: CaptionService, navigationService: NavigationService, activatedRoute: ActivatedRoute) {
    super(router, applicationService, navigationService, activatedRoute);
  }

  nextScreenRoute: string = '/building-registration/building/floors-above';
  building: { numberBlocks?: string } = {}
  numberBlocksHasErrors = false;

  updateNumberBlocksBuilding(numberBlockBuilding: string) {
    let block = this.applicationService.model.Blocks?.find(x => x.Id === this.blockId);
    if (block) block.NumberBlocksBuilding = numberBlockBuilding;

    this.captionService.caption = numberBlockBuilding === 'one'
      ? "Blocks in the building"
      : "First block in the building";
  }

  canContinue(): boolean {
    this.numberBlocksHasErrors = !this.applicationService.model.Blocks?.find(x => x.Id === this.blockId)?.NumberBlocksBuilding;
    return !this.numberBlocksHasErrors;
  }
}
